export class Component {
    type: string;
    dependencies: string[] = [];
    constructor(type: string, dependencies?: string[]) {
        this.type = type;
        if (dependencies) {
            dependencies.forEach(componentName => {
                this.dependencies.push(componentName);
            });
        }
    }
}
export class PositionComponent extends Component {
    x: number | void;
    y: number | void;
    constructor (x?: number, y?: number) {
        super('position');
        this.x = x;
        this.y = y;
    }
}