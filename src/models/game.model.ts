import EventEmitter from 'events';
import Room from './room.model';
import Round from './round.model';

export default class Game extends EventEmitter {
  rounds: Round[] = [];

  room: Room;

  constructor(room: Room) {
    super();
    this.room = room;
  }

  nextRound() {
    if (this.rounds.length >= 51) {
      throw 'Max rounds overwritten';
    }

    const round = new Round(this.rounds.length, this.room.players, this);

    this.rounds.push(round);

    this.emit('next');

    return round;
  }

  getActiveRound(): Round {
    const round = this.rounds[this.rounds.length - 1];

    if (!round) {
      throw 'No active round';
    }

    return round;
  }
}
