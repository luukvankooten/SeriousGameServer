import Room from './room.model';
import Round from './round.model';

export enum Role {
  RETAILER,
  WHOLESALER,
  DISTRIBUTER,
  MANUFACTURER,
  CUSTOMER,
  EMPTY,
}

type RoleString =
  | 'retailer'
  | 'wholesaler'
  | 'distributer'
  | 'manufacture'
  | 'customer'
  | 'empty';

export function roleFromString(role: string | undefined): Role | undefined {
  switch (role) {
    case 'retailer':
      return Role.RETAILER;
    case 'wholesaler':
      return Role.WHOLESALER;
    case 'distributer':
      return Role.DISTRIBUTER;
    case 'manufacture':
      return Role.MANUFACTURER;
    case 'customer':
      return Role.CUSTOMER;
    default:
      return undefined;
  }
}

export function roleToString(role: Role): RoleString {
  switch (role) {
    case Role.CUSTOMER:
      return 'customer';
    case Role.DISTRIBUTER:
      return 'distributer';
    case Role.WHOLESALER:
      return 'wholesaler';
    case Role.RETAILER:
      return 'retailer';
    case Role.MANUFACTURER:
      return 'manufacture';
    case Role.EMPTY:
      return 'empty';
  }
}

export default class Player {
  id: string;

  rounds: Round[];

  room: Room;

  role: Role;

  constructor(id: string, rounds: Round[], room: Room, role: Role) {
    this.id = id;
    this.rounds = rounds;
    this.room = room;
    this.role = role;
  }
}
