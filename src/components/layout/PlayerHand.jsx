import "./styles/PlayerHand.css";
import { useGame } from "../../utils/GameManager";
import SkillCard from "../cards/SkillCard";

export default function PlayerHand() {
  const { hand = [], skills = [], discardCard, useSkill, skillCooldowns = {} } = useGame();

  // hand is an array of instances: { instanceId, id, uses }
  const handItems = hand
    .map((inst) => {
      const def = skills.find((s) => s.id === inst.id);
      if (!def) return null;
      return { instance: inst, def };
    })
    .filter(Boolean);

  return (
    <div className="player-hand">
      {handItems.length === 0 ? (
        <p className="empty-hand">No cards in hand. Draw from deck.</p>
      ) : (
        handItems.map(({ instance, def }) => (
          <div key={instance.instanceId} className="hand-card">
            <SkillCard
              skillId={def.id}
              name={def.name}
              power={def.power}
              points={instance.uses}
              cooldown={skillCooldowns[def.id] || 0}
              description={def.description}
              onUse={() => useSkill(instance.instanceId)}
            />
            <button className="discard-btn" onClick={() => discardCard(instance.instanceId)}>
              Discard
            </button>
          </div>
        ))
      )}
    </div>
  );
}
