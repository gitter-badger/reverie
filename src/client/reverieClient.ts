// Reverie client
// Created by Jonathon Orsi
import { EventManager } from '../common/eventManager';
import { InputManager } from './inputManager';
import { Network } from './network';
import { Agent } from './agent';
import { World } from './world';
import { ReverieInterface } from './reverieInterface';
import { Renderer } from './renderer';
import * as EntityEvents from '../common/ecs/entityEvents';
import * as ClientPackets from '../common/network/clientPackets';

export class ReverieClient {
  agent: Agent;
  events: EventManager;
  inputManager: InputManager;
  network: Network;
  world: World;
  reverieInterface: ReverieInterface;
  renderer: Renderer;
  running = false;
  lastUpdate = new Date().getTime();
  accumulator: number;
  ticksPerSecond = 25;
  tickTime = 1000 / this.ticksPerSecond;
  ticks = 0;

  constructor() {
    const events = this.events = new EventManager();

    this.agent = new Agent(events);
    this.inputManager = new InputManager(events);
    this.network = new Network(events);
    this.world = new World(events);

    // create html interface
    this.reverieInterface = new ReverieInterface(events);

    // create renderer for world
    this.renderer = new Renderer(
      this.agent,
      this.world,
      this.reverieInterface.worldElement.canvas,
      this.reverieInterface.worldElement.bufferCanvas
    );

    // register inter-module events
    events.registerEvent('input/keyboard/down', (data) => this.onKeyDown(data));
    events.registerEvent('input/mouse/down', (data) => this.onMouseDown(data));
    events.registerEvent('input/window/resize', (data) => this.onWindowResize(data));
    events.registerEvent('terminal/message', (message: string) => this.onTerminalMessage(message));
    events.registerEvent('server', (data) => this.onServer(data));
    events.registerEvent('server/update', (data) => this.onServerUpdate(data));
    events.registerEvent('agent', (data) => this.onAgentEntity(data));
    events.registerEvent('world', (data) => this.onWorld(data));
    events.registerEvent('world/update', (data) => this.onWorldUpdate(data));
    events.registerEvent('entity', (data) => this.onEntity(data));
    events.registerEvent('entity/update', (data) => this.onEntityUpdate(data));
    events.registerEvent('tile', (data) => this.onTile(data));
    events.registerEvent('tile/update', (data) => this.onTileUpdate(data));
  }
  update () {
    if (this.running) {
      // timing
      const now = new Date().getTime();
      const delta = now - this.lastUpdate;
      this.lastUpdate = now;

      if (this.ticks % 100 === 0) {
        console.log(`last update was ${delta}ms`);
      }

      // process queued events
      this.events.process();

      // update world
      this.accumulator += delta;
      while (this.accumulator > this.tickTime) {
        this.world.update(this.tickTime);
        this.accumulator -= delta;
      }

      // draw world
      let interpolation = this.accumulator / this.tickTime;
      this.renderer.render(interpolation);

      this.ticks++;
      // call next update frame
      requestAnimationFrame(() => this.update());
    }
  }
  run () {
    this.running = true;
    this.update();
  }
  stop () {
    this.running = false;
  }

  // Events
  onKeyDown (data: any) {
    this.reverieInterface.getTerminalElement().onKey(data.key);
  }
  onMouseDown (mouseEvent: MouseEvent) {
    console.log(mouseEvent);
    switch (mouseEvent.button) {
      case 2:
        let direction = this.parseMouseDirection(mouseEvent);
        console.log(direction);
        this.network.send('entity/move', new ClientPackets.Move(this.agent.entityId, direction));
        break;
    }
  }
  onWindowResize (data: any) {
    this.reverieInterface.getWorldElement().onResize(data);
  }
  onTerminalMessage (message: string) {
    this.network.send('message', new ClientPackets.Message(message));
  }
  onServer (data: any) {
    console.log(data);
  }
  onServerUpdate (data: any) {
    console.log(data);
  }
  onAgentEntity (data: any) {
    console.log(data);
    this.agent.setEntityId(data.serial);
  }
  onWorld (data: any) {
    this.world.loadWorld(data);
  }
  onWorldUpdate (data: any) {
    this.world.updateWorld(data);
  }
  onEntity (entityCreate: EntityEvents.Create) {
    this.world.addEntity(entityCreate);
  }
  onEntityUpdate (data: any) {
    this.world.updateEntity(data);
  }
  onTile (data: any) {
    this.world.loadTile(data);
  }
  onTileUpdate (data: any) {
    this.world.updateTile(data);
  }

  parseMouseDirection (mouseEvent: MouseEvent) {
    let direction = '';
    let mouseX = mouseEvent.clientX;
    let mouseY = mouseEvent.clientY;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (mouseY <= Math.floor(height * (1 / 3))) direction += 'n';
    if (mouseY >= Math.floor(height * (2 / 3))) direction += 's';
    if (mouseX >= Math.floor(width * (2 / 3))) direction += 'e';
    if (mouseX <= Math.floor(width * (1 / 3))) direction += 'w';
    return direction;
  }
}

// initial run
let reverie = new ReverieClient();
reverie.run();
