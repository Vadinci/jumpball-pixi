import { InteractionEvent, InteractionManager } from "@pixi/interaction";
import { core } from "../../core";
import { Entity } from "../../ecs/Entity";
import { World } from "../../ecs/World";
import { BaseSystem } from "../BaseSystem";
import { GameComponents } from "../Components";

export class PlayerControllerSystem extends BaseSystem<GameComponents> {
	private _player: Entity;

	private _interaction: InteractionManager;

	private _pointerId: number = -1;
	private _pointerStartX: number = 0;
	private _playerStartX: number = 0;

	private _targetX: number = 0;

	constructor(world: World<GameComponents>, player: Entity) {
		super(world)
		this._player = player;

		const interaction: InteractionManager = core.services.app.app.renderer.plugins["interaction"];
		if (!interaction) {
			console.error("no interaction plugin!");
		}
		this._interaction = interaction;

		this._interaction.on("pointerdown", this._onPointerStart, this);
		this._interaction.on("pointermove", this._onPointerMove, this);
		this._interaction.on("pointerup", this._onPointerEnd, this);

		this._targetX = this._world.getComponent(player, "position").x;
	}

	public override tick(): void {
		const playerPos = this._world.getComponent(this._player, "position");
		const dx = this._targetX - playerPos.x;

		this._world.addComponent(this._player, "position", {
			x: playerPos.x + Math.max(-10, Math.min(dx, 10)),
			y: playerPos.y
		});
	}

	private _onPointerStart(e: InteractionEvent): void {
		if (this._pointerId !== -1) {
			return;
		}
		this._pointerId = e.data.pointerId;

		this._pointerStartX = e.data.global.x;
		this._playerStartX = this._world.getComponent(this._player, "position").x;
	}

	private _onPointerMove(e: InteractionEvent): void {
		if (this._pointerId !== e.data.pointerId) {
			return;
		}

		const dx = e.data.global.x - this._pointerStartX;
		this._targetX = this._playerStartX + dx;
	}

	private _onPointerEnd(e: InteractionEvent): void {
		if (this._pointerId !== e.data.pointerId) {
			return;
		}

		this._pointerId = -1;
	}
}