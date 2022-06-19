import { Server } from 'socket.io';
import EventEmitter from 'events';
import Room from './room.model';
import Round from './round.model';
import Order, { OrderType, orderTypeToString } from './order.model';
import { Role, roleToString } from './player.model';

export default class Game extends EventEmitter {
  rounds: Round[] = [];

  room: Room;

  constructor(room: Room) {
    super();
    this.room = room;
    //Push the first round on init
    this.rounds.push(new Round(this.rounds.length, room.players, this));
  }

  maxRounds() {
    return this.rounds.length >= 50;
  }

  nextRound(_io: Server, orders: Order[]) {
    if (this.maxRounds()) {
      throw 'Max rounds overwritten';
    }

    const provOrders = orders.filter((x) => x.type === OrderType.PROVIDED);
    const reqOrders = orders.filter((x) => x.type === OrderType.REQUESTED);

    const round = new Round(this.rounds.length, this.room.players, this);
    this.rounds.push(round);

    for(let i = 0; i < provOrders.length; i++) {
      let destination = this.room.players.find((x) => x.role === provOrders[i].role)?.id ?? '';

      _io.to(destination).emit('game:next', {
        roundLength: this.rounds.length,
        order: provOrders[i].order ?? 0,
        type: orderTypeToString(provOrders[i].type),
      });
    }

    for(let i = 0; i < reqOrders.length; i++) {
      let destination = this.room.players.find((x) => x.role === reqOrders[i].role)?.id ?? '';

      _io.to(destination).emit('game:next', {
        roundLength: this.rounds.length,
        order: reqOrders[i].order ?? 0,
        type: orderTypeToString(reqOrders[i].type),
      });
    }
    return round;
  }

  getActiveRound(): Round | undefined {
    const round = this.rounds[this.rounds.length - 1];

    return round;
  }

  getPreviousRound(): Round | undefined {
    const round = this.rounds[this.rounds.length - 2];

    return round;
  }
}
