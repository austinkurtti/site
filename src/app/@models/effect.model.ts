export class EffectParticle {
    public angularSpeed: number;
    public color: string;
    public direction: number;
    public linearSpeed: number;
    public opacity: number;
    public rotation: number;
    public rotationAxis: number[];
    public shape: string;
    public x: number;
    public y: number;

    constructor(partial?: Partial<EffectParticle>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
