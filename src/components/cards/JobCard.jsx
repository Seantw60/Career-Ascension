import "./styles/JobCard.css";

export default function JobCard({ title = "Software Engineer", hp = 10, maxHp = 10 }) {
  const hpPercent = (hp / maxHp) * 100;

  return (
    <div className="job-card">
      <h3 className="job-title">{title}</h3>
      <div className="job-hp-bar">
        <div className="job-hp-fill" style={{ width: `${hpPercent}%` }}></div>
      </div>
      <p className="job-hp-text">
        HP: {hp} / {maxHp}
      </p>
    </div>
  );
}
