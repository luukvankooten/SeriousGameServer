import Player from './player.model';
import Round from './round.model';

export enum OrderType {
  REQUESTED,
  PROVIDED,
}

export function fromString(order: 'reqeusted' | 'provided' | any): OrderType {
  switch (order) {
    case 'requested':
      return OrderType.REQUESTED;
    default:
      return OrderType.PROVIDED;
  }
}

export default class Order {
  order: number;

  player: Player;

  round: Round;

  type: OrderType;

  constructor(
    order: number,
    player: Player,
    round: Round,
    type: OrderType = OrderType.PROVIDED,
  ) {
    this.order = order;
    this.player = player;
    this.round = round;
    this.type = type;
  }
}
