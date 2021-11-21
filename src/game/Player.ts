import { Container } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import "@pixi/events";
import { PlayerController } from "./player/PlayerController";

export class Player {
	private _container: Container;
	private _loader: Loader;
	private _playerController: PlayerController;
	private _player: Sprite;

	private _velocity: Point = new Point();

	public get velocity():Point {
		return this._velocity;
	}

	public get position():Point {
		return this._player.position;
	}


	constructor(container: Container, loader: Loader) {
		this._container = container;
		this._loader = loader;

		const texture = this._loader.resources["player"].texture;
		if (!texture) {
			console.error("YO!");
		}

		this._player = new Sprite(texture!);
		this._player.anchor.set(0.5, 1);

		this._player.x = 160;

		this._playerController = new PlayerController(this._player.position);
	}

	public begin(): void {
		this._container.addChild(this._player);
		this._playerController.begin();
	}

	public tick(): void {
		this._velocity.y += 0.15;

		this._velocity.y *= 0.98;
		this._player.y += this._velocity.y;

		this._playerController.tick();
	}
}