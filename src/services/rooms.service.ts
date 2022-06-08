import * as crypto from 'crypto';

export interface Room {
  room: string;
  path: string;
  isFull: boolean;
}

const rooms: Map<string, Room> = new Map();

export function GetRooms() {
  return Array.from(rooms.values());
}

export function GetRoom(id: string) {
  return rooms.get(id);
}

export function AddRoom(room: Room) {
  const id = crypto.randomUUID();

  rooms.set(id, room);

  return id;
}
