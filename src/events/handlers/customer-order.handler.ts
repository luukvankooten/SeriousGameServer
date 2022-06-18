import { randomInt } from 'crypto';
import Game from '../../models/game.model';

export default function CustomerAiOrderHandler() {
  const handler = (game: Game) => {
    const ai = game.room.players.find((p) => p.id === 'ai');

    //For now randomInt as ai player: max is 100;
    if (ai) game.getActiveRound()?.addOrderAi(randomInt(100), ai);
  };

  return handler;
}
