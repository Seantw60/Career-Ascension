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
  // unique id for each card instance drawn into hand
  nextInstanceId: 1,
};

// --- Reducer ---
function gameReducer(state, action) {
  switch (action.type) {
    case "USE_SKILL": {
      const { instanceId } = action.payload;
      const job = state.jobs[state.currentJobIndex];
      if (!job) return state;

      // find instance in hand
      const hand = state.hand.map((c) => ({ ...c }));
      const idx = hand.findIndex((c) => c.instanceId === instanceId);
      if (idx === -1) return state;

      const instance = hand[idx];
      const skillDef = state.skills.find((s) => s.id === instance.id);
      if (!skillDef) return state;

      // check cooldown for skillDef.id
      const onCooldown = (state.skillCooldowns[skillDef.id] || 0) > 0;
      if (onCooldown || instance.uses <= 0 || job.hp <= 0) return state;

      // apply damage
      const newHp = Math.max(job.hp - skillDef.power, 0);
      const updatedJobs = state.jobs.map((j, i) => (i === state.currentJobIndex ? { ...j, hp: newHp } : j));

      // decrement uses for this instance
      hand[idx].uses = Math.max(0, hand[idx].uses - 1);

      // if uses are 0 -> move to discard and remove from hand
      const discard = [...state.discard];
      let newHand = hand;
      if (hand[idx].uses === 0) {
        const [removed] = newHand.splice(idx, 1);
        discard.push(removed.id);
      }

      // start cooldown for skill definition
      const newCooldowns = { ...state.skillCooldowns, [skillDef.id]: skillDef.cooldown };

      // draw one card automatically if possible
      let deck = [...state.deck];
      let nextInstanceId = state.nextInstanceId;
      if (newHand.length < 5) {
        if (deck.length === 0 && discard.length > 0) {
          deck = shuffle(discard);
          discard.length = 0;
        }
        if (deck.length > 0) {
          const nextId = deck.shift();
          const skillDef2 = state.skills.find((s) => s.id === nextId);
          const uses = skillDef2 ? Math.max(0, skillDef2.points) : 1;
          newHand.push({ instanceId: nextInstanceId++, id: nextId, uses });
        }
      }

      // logging
      const logEntry = `Used ${skillDef.name} on ${job.title} for ${skillDef.power} damage.`;

      // if job defeated, award points
      let nextScore = state.score;
      let nextJobsCleared = state.jobsCleared;
      if (newHp <= 0) {
        nextJobsCleared = state.jobsCleared + 1;
        nextScore = state.score + 10; // simple scoring rule
      }

      // loss condition: if deck empty and hand empty after this action
      const willDeckEmpty = deck.length === 0;
      const willHandEmpty = newHand.length === 0;
      const gameOver = willDeckEmpty && willHandEmpty && !(
        newHp <= 0 && state.currentJobIndex < state.jobs.length - 1
      );

      return {
        ...state,
        jobs: updatedJobs,
        hand: newHand,
        deck,
        discard,
        skillCooldowns: newCooldowns,
        turn: state.turn + 1,
        score: nextScore,
        jobsCleared: nextJobsCleared,
        gameOver,
        logs: [...state.logs, logEntry].slice(-50),
        nextInstanceId,
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
      let nextInstanceId = state.nextInstanceId;
      const handLimit = 5;

      for (let i = 0; i < count; i++) {
        if (hand.length >= handLimit) break;
        if (deck.length === 0 && discard.length > 0) {
          deck = shuffle(discard);
          discard = [];
        }
        if (deck.length === 0) break;
        const cardId = deck.shift();
        // find default points for this skill
        const skillDef = state.skills.find((s) => s.id === cardId);
        const uses = skillDef ? Math.max(0, skillDef.points) : 1;
        hand.push({ instanceId: nextInstanceId++, id: cardId, uses });
      }

      return { ...state, deck, hand, discard, nextInstanceId };
    }

    case "DISCARD_CARD": {
      const { instanceId } = action.payload;
      const hand = [...state.hand];
      const idx = hand.findIndex((c) => c.instanceId === instanceId);
      if (idx === -1) return state;
      const [removed] = hand.splice(idx, 1);
      const discard = [...state.discard, removed.id];
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
      // player failed the current job due to timeout -> deduct points, advance to next job and add a log
      const current = state.jobs[state.currentJobIndex];
      const log = current ? `Timed out on ${current.title}` : `Timed out`;
      const penalty = 5; // points lost on timeout
      const next = state.currentJobIndex + 1;
      const nextState = { ...state, score: Math.max(0, state.score - penalty), logs: [...state.logs, log, `- ${penalty} points`].slice(-50) };
      if (next >= state.jobs.length) return { ...nextState, gameOver: true };
      return { ...nextState, currentJobIndex: next, currentEvent: null };
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
  const useSkill = (instanceId) => dispatch({ type: "USE_SKILL", payload: { instanceId } });
  const nextJob = () => dispatch({ type: "NEXT_JOB" });
  const tickCooldowns = () => dispatch({ type: "TICK_COOLDOWNS" });
  const triggerEvent = (event) => dispatch({ type: "TRIGGER_EVENT", payload: event });
  const endGame = () => dispatch({ type: "END_GAME" });
  const drawCards = (count = 1) => dispatch({ type: "DRAW", payload: { count } });
  const discardCard = (instanceId) => dispatch({ type: "DISCARD_CARD", payload: { instanceId } });

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
