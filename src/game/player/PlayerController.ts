import { Point } from "@pixi/math";
import { InteractionEvent, InteractionManager } from "pixi.js";
import { core } from "../../core";

export class PlayerController {
	private _playerPosition: Point;
	private _interaction: InteractionManager;

	private _pointerId: number = -1;
	private _pointerStartX: number = 0;
	private _playerStartX: number = 0;

	private _targetX: number = 0;

	constructor(playerPosition: Point) {
		this._playerPosition = playerPosition;

		const interaction: InteractionManager = core.services.app.app.renderer.plugins["interaction"];
		if (!interaction) {
			console.error("no interaction plugin!");
		}
		this._interaction = interaction;
	}

	public begin(): void {
		this._interaction.on("pointerdown", this._onPointerStart, this);
		this._interaction.on("pointermove", this._onPointerMove, this);
		this._interaction.on("pointerup", this._onPointerEnd, this);

		this._targetX = this._playerPosition.x;
	}

	public tick(): void {
		const dx = this._targetX - this._playerPosition.x;
		this._playerPosition.x += Math.max(-10, Math.min(dx, 10));
	}

	private _onPointerStart(e: InteractionEvent): void {
		if (this._pointerId !== -1) {
			return;
		}
		this._pointerId = e.data.pointerId;

		this._pointerStartX = e.data.global.x;
		this._playerStartX = this._playerPosition.x;
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