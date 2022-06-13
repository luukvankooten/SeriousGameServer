import Player from './player.model';
import Round from './round.model';

export default class Order {
  order: number;

  player: Player;

  round: Round;

  constructor(order: number, player: Player, round: Round) {
    this.order = order;
    this.player = player;
    this.round = round;
  }
}
