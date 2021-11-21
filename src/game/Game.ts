import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Loader } from "@pixi/loaders";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Sprite } from "@pixi/sprite";
import { core } from "../core";
import { Platforms } from "./Platforms";
import { Platform } from "./platforms/Platform";
import { Player } from "./Player";
export class Game {

	private _container: Container;

	private _playerModule?: Player;
	private _platformModule?: Platforms;

	constructor() {
		const app = core.services.app.app;

		this._container = new Container();
		app.stage.addChild(this._container);

		const loader: Loader = new Loader("./assets/");
		loader.add("paddle", "paddle.png");
		loader.add("player", "player.png");

		loader.onComplete.add(loader => {
			this._playerModule = new Player(this._container, loader);
			this._playerModule.begin();

			this._platformModule = new Platforms(this._playerModule, this._container, loader);
			this._platformModule.begin();

			app.ticker.add((dt: number) => {
				this._platformModule?.tick();

				this._playerModule?.tick();
			});
		});
		loader.load();
	}
}