import * as crypto from 'crypto';

export interface Room {
  name: string;
  uri: string;
  connectionCount: number;
  isFull: boolean;
  isClosed: boolean;
}

const rooms: Map<string, Room> = new Map();

rooms.set('bc636f3a-16cc-459a-8436-425f7ea2c5c3', {
  name: 'Ali',
  uri: 'https://localhost:3000/?roomUri=bc636f3a-16cc-459a-8436-425f7ea2c5c3',
  isFull: false,
  connectionCount: 0,
  isClosed: false
});

export function GetRooms() {
  return rooms.entries();
}

export function GetRoom(id: string) {
  const room = rooms.get(id);

  if (!room) {
    throw "Room does not exist";
  }

  return room;
}

export function AddRoom(name: string) {
  const id = crypto.randomUUID();

  rooms.set(id, {
    name,
    connectionCount: 0,
    isFull: false,
    uri: `http://localhost:3000/?roomUri=${id}`,
    isClosed: false
  });

  return id;
}

export function HasRoom(id: string) {
  return rooms.has(id);
}

export function JoinRoom(id: string) {
  const room = GetRoom(id);

  if (room.isClosed) {
    throw 'Room is closed'
  }

  if (room.connectionCount >= 5) {
    room.isFull = true;

    throw 'Room is full';
  } 
  
  room.connectionCount += 1;
}

export function LeaveRoom(id: string) {
  const room = GetRoom(id);

  room.connectionCount -= 1;

  if (room.connectionCount === 0) {
    rooms.delete(id);
  }
}

export function CloseRoom(id: string) {
  const room = GetRoom(id);

  room.isClosed = true;
}