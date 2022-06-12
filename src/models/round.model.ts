import Player from './player.model';
import Invoice from './invoice.model';
import Game from './game.model';
import EventEmitter from 'events';

export default class Round extends EventEmitter {
  number: number;

  players: Player[];

  invoices: Invoice[] = [];

  game: Game;

  constructor(number: number, players: Player[], game: Game) {
    super();
    this.number = number;
    this.players = players;
    this.game = game;
  }

  addInvoice(order: number, player: Player) {
    if (!this.players.includes(player)) {
      throw 'Player not in room';
    }

    const i = this.invoices.findIndex((i) => i.player === player);

    if (i !== -1) {
      delete this.invoices[i];
    }

    const pInvoice = this.game
      .getPreviousRound()
      ?.invoices.find((i) => i.player === player);

    const backlog = pInvoice?.backlog ?? 0;

    const stock = pInvoice?.stock ?? 0;

    const invoice = new Invoice(this, player, 0, 0);

    if (stock === 0 && backlog > 0) {
    }

    this.invoices.push(invoice);
    this.emit('invoice:added', invoice);

    if (this.invoices.length === this.players.length) {
      this.game.nextRound();
    }
  }
}
