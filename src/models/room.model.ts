import EventEmitter from 'events';
import { Server } from 'socket.io';
import Game from './game.model';
import Player, { Role } from './player.model';

export default class Room extends EventEmitter {
  id: string;

  name: string;

  players: Player[] = [];

  game: Game | undefined;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
    this.emit('room:created');
  }

  isOpen(): boolean {
    return !(this.players.length >= 5) || this.game !== undefined;
  }

  addPlayer(player: Player) {
    if (!this.isOpen()) {
      throw 'Room is full';
    }

    this.players.push(player);

    this.emit('player:added', player);
  }

  getPlayer(id: string) {
    return this.players.find((p) => p.id === id);
  }

  private canStartGame() {
    const { length } = this.players;

    const nonEmptyRoles = this.players.some((p) => p.role !== Role.EMPTY);

    return (
      (length === 4 || length === 5) && this.game === undefined && nonEmptyRoles
    );
  }

  startGame(_io: Server) {
    if (!this.canStartGame()) {
      throw 'The game could not be started';
    }

    this.game = new Game(_io, this);

    if (this.players.length === 4) {
      this.players.push(
        new Player('ai', this.game.rounds, this, Role.CUSTOMER),
      );
    }

    this.emit('game:started', this.game);
    return this.game;
  }
}
