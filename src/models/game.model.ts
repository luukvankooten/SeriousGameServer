import EventEmitter from 'events';
import Room from './room.model';
import Round from './round.model';

export default class Game extends EventEmitter {
  rounds: Round[] = [];

  room: Room;

  constructor(room: Room) {
    super();
    this.room = room;
    //Push the first round on init
    this.rounds.push(new Round(this.rounds.length, room.players, this));
  }

  maxRounds() {
    return this.rounds.length >= 50;
  }

  nextRound() {
    if (this.maxRounds()) {
      throw 'Max rounds overwritten';
    }

    const round = new Round(this.rounds.length, this.room.players, this);

    this.rounds.push(round);

    this.emit('next', round);

    return round;
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
