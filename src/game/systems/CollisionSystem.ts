import { Entity } from "../../ecs/Entity";
import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { CpmResolvedCollision, GameComponents } from "../Components";
import { GRAVITY } from "../Constants";

type TopCollider = "position" | "topCollision";
type Player = "player" | "position" | "velocity";

export class CollisionSystem extends BaseSystem<GameComponents> {
	private _topColliderFamily: Family<GameComponents>;
	private _playerFamily: Family<GameComponents>;

	constructor(world: World<GameComponents>) {
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
		this._playerFamily.forEach(player => this._findCollisionForPlayer(player));
	}

	private _findCollisionForPlayer(player: Entity) {
		const pVelocity = this._world.getComponent(player, "velocity");
		const pPosition = this._world.getComponent(player, "position");

		let collisions: { y: number, collisionData: CpmResolvedCollision }[] = [];

		if (pVelocity.y > 0) {
			this._topColliderFamily.forEach(collider => {
				const cPosition = this._world.getComponent(collider, "position");
				const cWidth = this._world.getComponent(collider, "topCollision").width;

				const left = cPosition.x - cWidth / 2;
				const right = cPosition.x + cWidth / 2;
				const colliderY = cPosition.y;

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