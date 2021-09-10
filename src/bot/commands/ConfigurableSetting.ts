export abstract class Configurable<T> {
    constructor(public defaultValue: T, public userConfigurable: boolean) { }
}

export class DefaultTo<T> extends Configurable<T> {
    constructor(defaultValue: T){
        super(defaultValue, true);
    }
}

export class ForceTo<T> extends Configurable<T> {
    constructor(defaultValue: T){
        super(defaultValue, false);
    }
}