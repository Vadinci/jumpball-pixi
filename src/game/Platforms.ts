import { Container } from "@pixi/display";
import { Loader } from "@pixi/loaders";
import { Platform } from "./platforms/Platform";
import { Player } from "./Player";

export class Platforms {
	private _platforms: Platform[] = [];

	private _container: Container;
	private _loader: Loader;

	private _player: Player;

	private _speed: number = 1;

	constructor(player: Player, container: Container, loader: Loader) {
		this._container = container;
		this._loader = loader;

		this._player = player;
	}

	public begin(): void {
		const basePlatform = new Platform(this._loader.resources["paddle"].texture!, 320);
		basePlatform.sprite.x = 160;
		basePlatform.sprite.y = 540;
		this._container.addChild(basePlatform.sprite);

		this._platforms.push(basePlatform);

		for (let ii = 0; ii < 20; ii++) {
			const platform = new Platform(this._loader.resources["paddle"].texture!, 64);
			platform.sprite.x = Math.floor(Math.random()*320);
			platform.sprite.y = -25 - ii*(32 + Math.floor(Math.random()*16));
			this._container.addChild(platform.sprite);
	
			this._platforms.push(platform);
		}
	}

	public tick(): void {
		this._platforms.forEach(this._movePlatformDown, this);
		if (this._player.velocity.y > 0) {
			this._platforms.forEach(this._checkPlatformCollision, this);
		}
	}

	private _movePlatformDown(platform: Platform): void {
		if (platform === this._platforms[0]) return; // hack the floor :)
		platform.sprite.y += this._speed;

		if (platform.sprite.y >= 580){
			platform.sprite.y -= (600+Math.floor(Math.random()*24));
		}
	}

	private _checkPlatformCollision(platform: Platform): void {
		const velocity = this._player.velocity;
		const playerX = this._player.position.x;
		const playerY = this._player.position.y;
		const platformY = platform.sprite.y;

		if (platformY < playerY) return;
		if (platform.left > playerX) return;
		if (platform.right < playerX) return;

		// debugger;

		if (playerY + velocity.y > platformY) {
			const distanceLeft = platformY - playerY;
			const fraction = distanceLeft / velocity.y;

			let newY = platformY;
			const newVelocity = -8;
			newY += (1 - fraction) * newVelocity;
			//!!!! hacks so the next tick by player leads to the exact position we calculated here :/ 
			newY -= newVelocity;
			newY -= 0.15;
			newY /= 0.98;

			this._player.position.y = newY;
			this._player.velocity.y = newVelocity;

		}
	}
}