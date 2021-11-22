export interface ISystem {
	update(dt: number): void;
	tick(): void;
}