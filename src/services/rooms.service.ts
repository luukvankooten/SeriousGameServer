import * as crypto from 'crypto';
import Player, { Role } from '../models/player.model';
import Room from '../models/room.model';

const rooms: Map<string, Room> = new Map();

rooms.set(
  'bc636f3a-16cc-459a-8436-425f7ea2c5c3',
  new Room('bc636f3a-16cc-459a-8436-425f7ea2c5c3', 'room 1'),
);

rooms.set(
  '803f024d-fabc-4af6-a68b-1fb54e2f617c',
  new Room('803f024d-fabc-4af6-a68b-1fb54e2f617c', 'room 2'),
);

export function GetRooms() {
  return rooms.entries();
}

export function GetRoom(id: string) {
  const room = rooms.get(id);

  if (!room) {
    throw 'Room does not exist';
  }

  return room;
}

export function AddRoom(name: string) {
  const id = crypto.randomUUID();

  rooms.set(id, new Room(id, name));

  return id;
}

export function HasRoom(id: string) {
  return rooms.has(id);
}

export function JoinRoom(id: string, playerId: string): [Room, Player] | void {
  if (!HasRoom(id)) {
    return;
  }

  const room = GetRoom(id);

  if (!room.isOpen()) {
    return;
  }

  const player = new Player(playerId, [], room, Role.EMPTY);

  room.addPlayer(player);

  return [room, player];
}

export function LeaveRoom(id: string, playerId: string) {
  const room = GetRoom(id);

  const i = room.players.findIndex((p) => p.id === playerId);

  console.log(i, room);

  if (i >= 0) {
    delete room.players[i];
  }
}

export function CloseRoom(id: string) {
  rooms.delete(id);

  //room.room
}
