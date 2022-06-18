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
  | 'distributor'
  | 'manufacturer'
  | 'customer'
  | 'empty';

export function roleFromString(role: string | undefined): Role {
  switch (role) {
    case 'retailer':
      return Role.RETAILER;
    case 'wholesaler':
      return Role.WHOLESALER;
    case 'distributor':
      return Role.DISTRIBUTER;
    case 'manufacturer':
      return Role.MANUFACTURER;
    case 'customer':
      return Role.CUSTOMER;
    default:
      return Role.EMPTY;
  }
}

export function roleToString(role: Role): RoleString {
  switch (role) {
    case Role.CUSTOMER:
      return 'customer';
    case Role.DISTRIBUTER:
      return 'distributor';
    case Role.WHOLESALER:
      return 'wholesaler';
    case Role.RETAILER:
      return 'retailer';
    case Role.MANUFACTURER:
      return 'manufacturer';
    default:
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

  assignRole(role: Role) {
    if (this.room.players.some((p) => p.role === role)) {
      throw 'Role already in use';
    }

    this.role = role;
  }
}
