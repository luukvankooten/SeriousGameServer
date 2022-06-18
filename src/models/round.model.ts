import { Server, Socket } from 'socket.io';
import Player from './player.model';
import Game from './game.model';
import EventEmitter from 'events';
import Order, { OrderType } from './order.model';

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

  addOrderAi(
    order: number,
    player: Player,
    type: OrderType = OrderType.PROVIDED,
  ) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const i = this.orders.findIndex((i) => i.player === player);

    console.log(this.orders);

    const orderInstance = new Order(order, player, this, type);
    this.orders.push(orderInstance);
  }

  addOrder(
    _io: Server,
    order: number,
    player: Player,
    type: OrderType = OrderType.PROVIDED,
  ) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const i = this.orders.findIndex((i) => i.player === player);

    // if (i !== -1) {
    //   this.orders.splice(i, 1);
    // }

    const orderInstance = new Order(order, player, this, type);
    this.orders.push(orderInstance);

    console.log(`Orders: ${this.orders.length}`);

    if (
      this.orders.length === this.players.length * 2 &&
      !this.game.maxRounds()
    ) {
      this.game.nextRound(_io, this.orders);
    }
  }
}
