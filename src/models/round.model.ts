import Player from './player.model';
import Game from './game.model';
import EventEmitter from 'events';
import Order from './order.model';

export default class Round extends EventEmitter {
  number: number;

  players: Player[];

  orders: Order[] = [];

  game: Game;

  constructor(number: number, players: Player[], game: Game) {
    super();
    this.number = number;
    this.players = players;
    this.game = game;
  }

  addOrder(order: number, player: Player) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const i = this.orders.findIndex((i) => i.player === player);

    if (i !== -1) {
      this.orders.splice(i);
    }

    const orderInstance = new Order(order, player, this);
    this.orders.push(orderInstance);
    this.emit('invoice:added', orderInstance);

    if (this.orders.length === this.players.length && !this.game.maxRounds()) {
      this.game.nextRound();
    }
  }
}
