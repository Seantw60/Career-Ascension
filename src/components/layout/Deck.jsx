import "./styles/Deck.css";

export default function Deck({ count = 5, onDraw }) {
  return (
    <div className="deck-container" onClick={onDraw}>
      <div className="deck-card-back"></div>
      <p className="deck-count">Cards: {count}</p>
    </div>
  );
}
