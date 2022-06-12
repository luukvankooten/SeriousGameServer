import Player from './player.model';
import Round from './round.model';

export default class Invoice {
  backlog: number;

  stock: number;

  round: Round;

  player: Player;

  constructor(round: Round, player: Player, stock: number, backlog: number) {
    this.round = round;
    this.player = player;
    this.stock = stock;
    this.backlog = backlog;
  }
}
