import { Server, Socket } from 'socket.io';
import Player, { Role } from './player.model';
import Game from './game.model';
import EventEmitter from 'events';
import Order, { OrderType } from './order.model';

export default class Round extends EventEmitter {
  number: number;

  players: Player[];

  orders: Order[] = [];

  doneCount: number;

  game: Game;

  constructor(number: number, players: Player[], game: Game) {
    super();
    this.number = number;
    this.players = players;
    this.game = game;
    this.doneCount = 0;
  }

  addOrderAi(
    order: number,
    player: Player,
    type: OrderType = OrderType.PROVIDED,
  ) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const orderInstance = new Order(order, Role.CUSTOMER, player, this, type);
    this.orders.push(orderInstance);
  }

  addOrder(
    _io: Server,
    order: number,
    role: Role,
    player: Player,
    type: OrderType = OrderType.PROVIDED,
    done: boolean,
  ) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const orderInstance = new Order(order, role, player, this, type);
    this.orders.push(orderInstance);
    this.doneCount += done ? 1 : 0;

    if (this.doneCount === this.players.length && !this.game.maxRounds()) {
      this.doneCount = 0;
      this.game.nextRound(this.orders);
    }
  }
}
