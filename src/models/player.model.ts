import Invoice from './invoice.model';
import Room from './room.model';
import Round from './round.model';

export default class Player {
  id: string;

  rounds: Round[];

  room: Room;

  constructor(id: string, rounds: Round[], room: Room) {
    this.id = id;
    this.rounds = rounds;
    this.room = room;
  }

  setInvoice(invoice: Invoice) {
    const round = this.room.game?.getActiveRound();

    if (!round) {
      throw 'Game has not started';
    }

    round.invoices.push(invoice);
  }
}
