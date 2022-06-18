import Player, { Role } from './player.model';
import Round from './round.model';

export enum OrderType {
  REQUESTED,
  PROVIDED,
}

export type StringOrder = 'requested' | 'provided';

export function orderTypeFromString(order: StringOrder | any): OrderType {
  switch (order) {
    case 'requested':
      return OrderType.REQUESTED;
    default:
      return OrderType.PROVIDED;
  }
}

export function orderTypeToString(type: OrderType): StringOrder {
  switch (type) {
    case OrderType.REQUESTED:
      return 'requested';
    default:
      return 'provided';
  }
}

export default class Order {
  order: number;

  role: Role;

  player: Player;

  round: Round;

  type: OrderType;

  constructor(
    order: number,
    role: Role,
    player: Player,
    round: Round,
    type: OrderType = OrderType.PROVIDED,
  ) {
    this.order = order;
    this.role = role;
    this.player = player;
    this.round = round;
    this.type = type;
  }
}
