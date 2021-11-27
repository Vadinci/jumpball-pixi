import { Entity } from "../../ecs/Entity";
import { Family } from "../../ecs/Family";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { CmpPosition, CmpVelocity, GameComponents } from "../Components";
import { GRAVITY } from "../Constants";

type CollisionData = {
	positionY: number,
	collider: Entity,
	newVY: number,
	travelRemaining: number
};

export class PlayerMovementSystem extends BaseSystem<GameComponents> {
	private _topColliderFamily: Family<GameComponents>;

	private _player: Entity;

	constructor(world: World<GameComponents>, player: Entity) {
		super(world);

		this._player = player;

		this._topColliderFamily = this._createFamily([
			"position",
			"topCollision"
		]);
	}

	public override tick(): void {
		let collision: CollisionData | undefined;
		const velocity = this._world.getComponent(this._player, "velocity");
		const position = this._world.getComponent(this._player, "position");

		if (velocity.y > 0) {
			collision = this._findTopCollision(position, velocity);
		}

		if (collision) {
			this._world.addComponent(this._player, "position", {
				x: position.x,
				y: collision.positionY - collision.travelRemaining
			});
			this._world.addComponent(this._player, "velocity", {
				x: velocity.x,
				y: collision.newVY
			});
		} else {
			this._world.addComponent(this._player, "position", {
				x: position.x,
				y: position.y + velocity.y
			});
			this._world.addComponent(this._player, "velocity", {
				x: velocity.x,
				y: velocity.y + GRAVITY
			});
		}
	}

	private _findTopCollision(pPosition: CmpPosition, pVelocity: CmpVelocity): CollisionData | undefined {
		let collision: CollisionData | undefined;

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

				if (!collision || cPosition.y < collision.positionY) {
					collision = {
						positionY: cPosition.y,
						collider,
						newVY,
						travelRemaining
					}
				}
			});
		}

		return collision;
	}
}