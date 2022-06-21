import { Server } from 'socket.io';
import EventEmitter from 'events';
import Room from './room.model';
import Round from './round.model';
import Order, { OrderType, orderTypeToString } from './order.model';
import { Role, roleToString } from './player.model';

export default class Game extends EventEmitter {
  _io: Server;

  rounds: Round[] = [];

  room: Room;

  chat: boolean;

  constructor(io: Server, room: Room) {
    super();
    this._io = io;
    this.room = room;
    this.chat = false;
    //Push the first round on init
    this.rounds.push(new Round(this.rounds.length, room.players, this));
  }

  maxRounds() {
    return this.rounds.length >= 50;
  }

  nextRound(orders: Order[]) {
    if (this.maxRounds()) {
      const history = this.room.game?.getHistory() ?? [];
      this._io.emit('game:end', {
        message: "Max turns reached, game concluded",
        history
      });
      throw 'Max rounds overwritten';
    }

    const provOrders = orders.filter((x) => x.type === OrderType.PROVIDED);
    const reqOrders = orders.filter((x) => x.type === OrderType.REQUESTED);

    const round = new Round(this.rounds.length, this.room.players, this);
    this.rounds.push(round);

    for(let i = 0; i < provOrders.length; i++) {
      let destination = this.room.players.find((x) => x.role === provOrders[i].role)?.id ?? '';

      this._io.to(destination).emit('game:next', {
        roundLength: this.rounds.length,
        order: provOrders[i].order ?? 0,
        type: orderTypeToString(provOrders[i].type),
      });
    }

    for(let i = 0; i < reqOrders.length; i++) {
      let destination = this.room.players.find((x) => x.role === reqOrders[i].role)?.id ?? '';

      this._io.to(destination).emit('game:next', {
        roundLength: this.rounds.length,
        order: reqOrders[i].order ?? 0,
        type: orderTypeToString(reqOrders[i].type),
      });
    }

    // Customer needs game:next aswell, even though no orders are available for the customer
    let customerId = this.room.players.find((x) => x.role === Role.CUSTOMER)?.id;
    if (customerId) {
      this._io.to(customerId).emit('game:next', {
        roundLength: this.rounds.length,
        role: roleToString(Role.CUSTOMER),
        order: 0,
        type: orderTypeToString(OrderType.REQUESTED),
      });
    }

    return round;
  }

  getHistory() {
    return this.getRounds().map((x) => ({
      roundLength: x.number,
      orders: x.orders.map((o) => ({
        order: o.order,
        type: orderTypeToString(o.type),
        role: roleToString(o.role)
      })),
    }));
  }

  getRounds(): Round[] {
    return this.rounds;
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
