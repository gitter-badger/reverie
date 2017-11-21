import { Entity } from '../../../common/models';
import { BaseEntity } from '../../../common/entities/baseEntity';
import { WorldModule } from '../../worldModule';

export class SocketEntity extends BaseEntity {
    socket: SocketIO.Socket;
    world: WorldModule;
    constructor (socket: SocketIO.Socket, world: WorldModule, entity?: Entity) {
        super(entity);
        this.socket = socket;
        this.world = world;

        // attach socket events
        socket.on('disconnect', (data) => this.world.onEntityDisconnect(this, data));
        socket.on('message', (data) => this.world.onEntityMessage(this, data));
        socket.on('move', (data) => this.world.onEntityMove(this, data));
        socket.on('focus', (data) => this.world.onEntityFocus(this, data));
        socket.on('interact', (data) => this.world.onEntityInteract(this, data));
        socket.on('action', (data) => this.world.onEntityAction(this, data));
    }
    send (event: string, data?: any) {
        this.socket.emit(event, data);
    }
}