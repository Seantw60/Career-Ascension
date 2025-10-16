import "./styles/PlayerHand.css";
import { useGame } from "../../utils/GameManager";
import SkillCard from "../cards/SkillCard";

export default function PlayerHand() {
  const { hand = [], skills = [], discardCard, useSkill, skillCooldowns = {} } = useGame();

  const handSkills = hand.map((id) => skills.find((s) => s.id === id)).filter(Boolean);

  return (
    <div className="player-hand">
      {handSkills.length === 0 ? (
        <p className="empty-hand">No cards in hand. Draw from deck.</p>
      ) : (
        handSkills.map((skill) => (
          <div key={skill.id} className="hand-card">
            <SkillCard
              skillId={skill.id}
              name={skill.name}
              power={skill.power}
              points={skill.points}
              cooldown={skillCooldowns[skill.id] || 0}
              description={skill.description}
              onUse={(id) => useSkill(id)}
            />
            <button className="discard-btn" onClick={() => discardCard(skill.id)}>
              Discard
            </button>
          </div>
        ))
      )}
    </div>
  );
}
