import "./styles/Deck.css";
import { useGame } from "../../utils/GameManager";

export default function Deck() {
  const { deck = [], drawCards } = useGame();
  return (
    <div className="deck-container" onClick={() => drawCards(1)} role="button" tabIndex={0}>
      <div className="deck-card-back"></div>
      <p className="deck-count">Deck: {deck.length}</p>
    </div>
  );
}
