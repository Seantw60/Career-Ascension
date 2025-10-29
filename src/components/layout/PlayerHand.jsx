// src/components/layout/PlayerHand.jsx
import "./styles/PlayerHand.css";
import { useGame } from "../../utils/GameManager";
import SkillCard from "../cards/SkillCard";

export default function PlayerHand() {
  const {
    hand = [],
    skills = [],
    discardCard,
    useSkill,
    skillCooldowns = {},
    jobs = [],
    currentJobIndex,
  } = useGame();

  const currentJob = jobs[currentJobIndex];

  // hand is an array of instances: { instanceId, id, uses }
  const handItems = hand
    .map((inst) => {
      const def = skills.find((s) => s.id === inst.id);
      if (!def) return null;
      const isCritical = currentJob?.skills?.includes(def.name); // ✅ mark critical cards
      return { instance: inst, def, isCritical };
    })
    .filter(Boolean);

  return (
    <div className="player-hand">
      {handItems.length === 0 ? (
        <p className="empty-hand">No cards in hand. Draw from deck.</p>
      ) : (
        handItems.map(({ instance, def, isCritical }) => (
          <div
            key={instance.instanceId}
            className={`hand-card ${isCritical ? "critical-highlight" : ""}`}
          >
            <SkillCard
              skillId={def.id}
              name={def.name}
              power={def.power}
              points={instance.uses}
              cooldown={skillCooldowns[def.id] || 0}
              description={def.description}
              onUse={() => useSkill(instance.instanceId)}
            />
            <button
              className="discard-btn"
              onClick={() => discardCard(instance.instanceId)}
            >
              Discard
            </button>
          </div>
        ))
      )}
    </div>
  );
}
