import Player from './player.model';
import Round from './round.model';

export default class Invoice {
  backlog = 0;

  stock = 0;

  round: Round;

  player: Player;

  constructor(round: Round, player: Player) {
    this.round = round;
    this.player = player;
  }
}
