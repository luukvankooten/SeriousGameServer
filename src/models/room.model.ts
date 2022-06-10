import EventEmitter from 'events';
import Game from './game.model';
import Player from './player.model';

export default class Room extends EventEmitter {
  id: string;

  name: string;

  players: Player[] = [];

  game: Game | undefined;

  constructor(id: string, name: string) {
  	super();
    this.id = id;
    this.name = name;
  }

  addPlayer(player: Player) {
    if (this.players.length >= 5) {
      throw 'Room is full';
    }

    this.players.push(player);

    this.emit('playerAdded', player);
  }

  startGame() {
    const { length } = this.players;
    
    if (!(length === 4 || length === 5)) {
      throw 'Cannot start game due too players length';
    }

    if (this.game !== undefined) {
      throw 'Game already has been started';
    }

    this.game = new Game(this);

    this.emit('gameStart', this.game);

    return this.game;
  }
}
