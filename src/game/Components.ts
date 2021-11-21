import { DisplayObject } from "@pixi/display";
import { Component } from "../ecs/Component";

// @TODO autogenerate file

export type CmpPosition = { x: number, y: number };
export type CmpVelocity = { x: number, y: number };
export type CmpDisplayObject = { displayObject: DisplayObject };

// type and implementation need to be seperated in order for TypeScript to properly deal with all the generics that are happening
export type GameComponents = {
	position: Component<CmpPosition>,
	velocity: Component<CmpVelocity>,
	displayObject: Component<CmpDisplayObject>,
}

export const gameComponents: GameComponents = {
	position: new Component(),
	velocity: new Component(),
	displayObject: new Component(),
}