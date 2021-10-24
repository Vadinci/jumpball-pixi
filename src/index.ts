import { core } from "./core";
import { Game } from "./game/Game";

const bootstrap = async ()=>{
	await core.initialize();
	console.log("hello world");
	new Game();
};

bootstrap();