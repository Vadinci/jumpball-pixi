import { Entity } from "../../ecs/Entity";
import { BaseSystem, Family, FamilyComponents, World } from "../BaseSystem";
import { CpmResolvedCollision, GameComponents } from "../Components";
import { GRAVITY } from "../Constants";

type TopCollider = "position" | "topCollision";
type Player = "player" | "position" | "velocity";

export class CollisionSystem extends BaseSystem {
	private _topColliderFamily: Family<TopCollider>;
	private _playerFamily: Family<Player>;

	constructor(world: World) {
		super(world);

		this._topColliderFamily = this._createFamily([
			"position",
			"topCollision"
		]);

		this._playerFamily = this._createFamily([
			"player",
			"position",
			"velocity"
		]);
	}

	public override tick(): void {
		this._playerFamily.forEach((player, components) => {
			this._findCollisionForPlayer(player, components);
		});
	}

	private _findCollisionForPlayer(player: Entity, playerComponents: FamilyComponents<Player>) {
		const pVelocity = playerComponents.velocity;
		const pPosition = playerComponents.position;

		let collisions: { y: number, collisionData: CpmResolvedCollision }[] = [];

		if (pVelocity.y > 0) {
			this._topColliderFamily.forEach((collider, colliderComponents) => {
				const left = colliderComponents.position.x - colliderComponents.topCollision.width / 2;
				const right = colliderComponents.position.x + colliderComponents.topCollision.width / 2;
				const colliderY = colliderComponents.position.y;

				if (pPosition.x < left || pPosition.x > right) return;

				if (colliderY < pPosition.y) return; // this collider is already above the player, so a top collision is not possible
				if (pPosition.y + pVelocity.y < colliderY) return; // the player won't hit this collider in the coming frame

				// @TODO improve, if the collider also has a velocity, find the exact point of collision
				const dy = colliderY - pPosition.y;
				const travelRemaining = (pVelocity.y - dy) * 0.5;	// @TODO magic number for bounce

				const newY = colliderY - travelRemaining;	// travel after the bounce

				const bounceHeight: number = 150;	// @TODO might be different per collider
				const bounceRemaining = bounceHeight - travelRemaining;
				const newVY = -Math.sqrt(GRAVITY * 2 * bounceRemaining);

				const collisionData: CpmResolvedCollision = {
					newY,
					newVY
				}

				collisions.push({ y: colliderY, collisionData });
			});

			collisions.sort((a, b) => a.y - b.y);
		}

		if (collisions.length > 0) {
			this._world.addComponent(player, "resolvedCollision", collisions[0].collisionData);
		}
	}
}