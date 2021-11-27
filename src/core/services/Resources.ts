import { Loader, LoaderResource } from "@pixi/loaders";
import { IService } from "../interfaces/IService";
import { Event } from "../classes/Event";
import { Texture } from "@pixi/core";

type request = [nameOrUrl: string, url?: string];

export interface LoaderProgress {
	readonly count: number;
	readonly loaded: number;
	onProgress: Event<[loader: LoaderProgress]>;
	complete: Promise<void>
}

export class ResourceService implements IService {
	private _basePath: string = "";
	private _resources: { [key: string]: LoaderResource } = {};

	constructor(basePath: string = "") {
		this._basePath = basePath;
	}

	public async initialize(): Promise<void> {
		//
	}

	public getTexture(key: string): Texture {
		const texture = this._resources[key].texture;
		if (!texture) {
			throw new Error(`resource ${key} is not loaded or is not a texture`); // @TODO improve
		}
		return texture;
	}

	public load(requests: request[]): LoaderProgress {
		const loader: Loader = new Loader(this._basePath);
		requests.forEach(req => {
			let name = req[0];
			let url = req[1];
			if (!url) {
				url = name;
				name = name.split(".")[0];
			}

			if (this._resources[name]) {
				throw new Error(`already loaded resource with name ${name}`);
			}
			// @TODO prevent multiple concurrent loads on the same name

			loader.add(name, url);
		});

		const progress = {
			count: requests.length,
			loaded: 0,
			onProgress: new Event<[LoaderProgress]>(),
			complete: new Promise<void>((resolve, reject) => {
				loader.onComplete.once(() => resolve());
			})
		};

		loader.onLoad.add(() => {
			progress.count++;
			progress.onProgress.fire(progress);
		});

		loader.onComplete.once(() => {
			loader.onLoad.detachAll();
			Object.keys(loader.resources).forEach(key => {
				this._resources[key] = loader.resources[key];
			});
		})

		loader.onError.add(err => {
			throw err;
		});

		loader.load();

		return progress;
	}

}