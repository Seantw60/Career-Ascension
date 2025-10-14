import "./styles/EventCard.css";

export default function EventCard({
  title = "Networking Event",
  description = "Swap one skill for a random one from your deck.",
  effect = "swapSkill"
}) {
  return (
    <div className="event-card">
      <h4 className="event-title">{title}</h4>
      <p className="event-description">{description}</p>
      <div className="event-effect">Effect: {effect}</div>
    </div>
  );
}
