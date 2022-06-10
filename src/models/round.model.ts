import Player from './player.model';
import Invoice from './invoice.model';
import Game from './game.model';

export default class Round {
  number: number;

  players: Player[];

  invoices: Invoice[] = [];

  game: Game;

  constructor(number: number, players: Player[], game: Game) {
    this.number = number;
    this.players = players;
    this.game = game;
  }
}
