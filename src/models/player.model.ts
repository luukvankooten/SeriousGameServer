import Room from './room.model';
import Round from './round.model';

export enum Role {
  RETAILER,
  WHOLESALER,
  DISTRIBUTER,
  MANUFACTURER,
  CUSTOMER,
}

type RoleString =
  | 'retailer'
  | 'wholesaler'
  | 'distrinuter'
  | 'manufacture'
  | 'customer';

export function roleFromString(role: RoleString): Role {
  switch (role) {
    case 'retailer':
      return Role.RETAILER;
    case 'wholesaler':
      return Role.WHOLESALER;
    case 'distrinuter':
      return Role.DISTRIBUTER;
    case 'manufacture':
      return Role.MANUFACTURER;
    case 'customer':
      return Role.CUSTOMER;
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
