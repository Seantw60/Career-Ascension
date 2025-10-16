// src/utils/GameManager.js
import { createContext, useContext, useReducer } from "react";
import { skillsData, jobsData, eventsData } from "../data/data";
import shuffle from "./shuffle";

// --- Initial State ---
const initialState = {
  jobs: jobsData,
  skills: skillsData,
  events: eventsData,
  currentJobIndex: 0,
  currentEvent: null,
  skillCooldowns: {},
  turn: 0,
  gameOver: false,
  // gameplay counters
  score: 0,
  jobsCleared: 0,
  // simple turn log
  logs: [],
  // deck/hand/discard
  hand: [],
  deck: shuffle(skillsData.flatMap((s) => new Array(3).fill(s.id))),
  discard: [],
};

// --- Reducer ---
function gameReducer(state, action) {
  switch (action.type) {
    case "USE_SKILL": {
      const { skillId } = action.payload;
      const skillIndex = state.skills.findIndex((s) => s.id === skillId);
      const skill = state.skills[skillIndex];
      const job = state.jobs[state.currentJobIndex];

      // basic validations
      if (!skill || !job) return state;
      // if no uses left or on cooldown, ignore
      const onCooldown = (state.skillCooldowns[skillId] || 0) > 0;
      if (skill.points <= 0 || onCooldown || job.hp <= 0) return state;

      const newHp = Math.max(job.hp - skill.power, 0);

      const updatedJobs = state.jobs.map((j, i) =>
        i === state.currentJobIndex ? { ...j, hp: newHp } : j
      );

      // decrement skill points
      const updatedSkills = state.skills.map((s, i) =>
        i === skillIndex ? { ...s, points: Math.max(0, s.points - 1) } : s
      );

      // start cooldown for that skill
      const newCooldowns = { ...state.skillCooldowns, [skillId]: skill.cooldown };

      // logging
      const jobTitle = job.title;
      const logEntry = `Used ${skill.name} on ${jobTitle} for ${skill.power} damage.`;

      // if job defeated, award points
      let nextScore = state.score;
      let nextJobsCleared = state.jobsCleared;
      if (newHp <= 0) {
        nextJobsCleared = state.jobsCleared + 1;
        nextScore = state.score + 10; // simple scoring rule
      }

      return {
        ...state,
        jobs: updatedJobs,
        skills: updatedSkills,
        skillCooldowns: newCooldowns,
        turn: state.turn + 1,
        score: nextScore,
        jobsCleared: nextJobsCleared,
        gameOver: newHp <= 0 && state.currentJobIndex === state.jobs.length - 1,
        logs: [...state.logs, logEntry].slice(-50),
      };
    }

    case "NEXT_JOB": {
      const next = state.currentJobIndex + 1;
      if (next >= state.jobs.length)
        return { ...state, gameOver: true };
      return { ...state, currentJobIndex: next, currentEvent: null };
    }

    case "DRAW": {
      const count = action.payload?.count || 1;
      let deck = [...state.deck];
      let hand = [...state.hand];
      let discard = [...state.discard];
      const handLimit = 5;

      for (let i = 0; i < count; i++) {
        if (hand.length >= handLimit) break;
        if (deck.length === 0 && discard.length > 0) {
          deck = shuffle(discard);
          discard = [];
        }
        if (deck.length === 0) break;
        const card = deck.shift();
        hand.push(card);
      }

      return { ...state, deck, hand, discard };
    }

    case "DISCARD_CARD": {
      const { skillId } = action.payload;
      const hand = [...state.hand];
      const idx = hand.indexOf(skillId);
      if (idx === -1) return state;
      hand.splice(idx, 1);
      const discard = [...state.discard, skillId];
      return { ...state, hand, discard };
    }

    case "TICK_COOLDOWNS": {
      const updated = Object.fromEntries(
        Object.entries(state.skillCooldowns).map(([id, c]) => [id, Math.max(0, c - 1)])
      );
      return { ...state, skillCooldowns: updated };
    }

    case "TRIGGER_EVENT": {
      const event = action.payload;
      // apply simple event effects synchronously
      let newState = { ...state, currentEvent: event, logs: [...state.logs, `Event: ${event.title}`].slice(-50) };

      const applyEffect = (effect) => {
        switch (effect) {
          case "drawSkill": {
            // restore 1 point to a random skill
            const idx = Math.floor(Math.random() * newState.skills.length);
            newState = {
              ...newState,
              skills: newState.skills.map((s, i) => (i === idx ? { ...s, points: s.points + 1 } : s)),
              logs: [...newState.logs, `Gained +1 point to ${newState.skills[idx].name}`].slice(-50),
            };
            break;
          }
          case "swapSkill": {
            // shuffle skills order as a simple swap
            const a = 0;
            const b = Math.floor(Math.random() * newState.skills.length);
            const skillsCopy = [...newState.skills];
            const tmp = skillsCopy[a];
            skillsCopy[a] = skillsCopy[b];
            skillsCopy[b] = tmp;
            newState = { ...newState, skills: skillsCopy, logs: [...newState.logs, `Swapped skills positions`].slice(-50) };
            break;
          }
          case "loseSkill": {
            const idx = Math.floor(Math.random() * newState.skills.length);
            newState = {
              ...newState,
              skills: newState.skills.map((s, i) => (i === idx ? { ...s, points: Math.max(0, s.points - 1) } : s)),
              logs: [...newState.logs, `Lost 1 point from ${newState.skills[idx].name}`].slice(-50),
            };
            break;
          }
          case "healSkillPoints": {
            newState = {
              ...newState,
              skills: newState.skills.map((s) => ({ ...s, points: s.points + 1 })),
              logs: [...newState.logs, `Restored 1 point to all skills`].slice(-50),
            };
            break;
          }
          default:
            break;
        }
      };

      if (event?.effect) applyEffect(event.effect);

      return newState;
    }

    case "END_GAME":
      return { ...state, gameOver: true };

    case "TIMEOUT": {
      // player failed the current job due to timeout -> advance to next job and add a log
      const current = state.jobs[state.currentJobIndex];
      const log = current ? `Timed out on ${current.title}` : `Timed out`;
      const next = state.currentJobIndex + 1;
      if (next >= state.jobs.length) return { ...state, gameOver: true, logs: [...state.logs, log].slice(-50) };
      return { ...state, currentJobIndex: next, currentEvent: null, logs: [...state.logs, log].slice(-50) };
    }

    default:
      return state;
  }
}

// --- Context Setup ---
const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Action wrappers
  const useSkill = (skillId) => dispatch({ type: "USE_SKILL", payload: { skillId } });
  const nextJob = () => dispatch({ type: "NEXT_JOB" });
  const tickCooldowns = () => dispatch({ type: "TICK_COOLDOWNS" });
  const triggerEvent = (event) => dispatch({ type: "TRIGGER_EVENT", payload: event });
  const endGame = () => dispatch({ type: "END_GAME" });
  const drawCards = (count = 1) => dispatch({ type: "DRAW", payload: { count } });
  const discardCard = (skillId) => dispatch({ type: "DISCARD_CARD", payload: { skillId } });

  return (
    <GameContext.Provider
      value={{
          ...state,
          useSkill,
          nextJob,
          tickCooldowns,
          triggerEvent,
          endGame,
          drawCards,
          discardCard,
          dispatch,
        }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
