import { randomInt } from 'crypto';
import Game from '../../models/game.model';
import Round from '../../models/round.model';

export default function RegisterCustomerOrderHandler(game: Game) {
  game.on('next', (round: Round) => {
    const ai = game.room.players.find((p) => p.id === 'ai');
    //For now randomInt as ai player: max is 100;
    if (ai) round.addOrder(randomInt(100), ai);
  });
}
