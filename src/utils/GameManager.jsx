// src/utils/GameManager.jsx
import { createContext, useContext, useReducer, useState } from "react";
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
  critical: false,
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

function ensureCriticalCard(hand, deck, discard, skills, job) {
  const jobSkills = job?.skills || [];
  const hasCritical = hand.some((c) => {
    const def = skills.find((s) => s.id === c.id);
    return jobSkills.includes(def?.name);
  });

  if (hasCritical) return { hand, deck, discard };

  const availableCriticals = [...deck, ...discard].filter((id) => {
    const def = skills.find((s) => s.id === id);
    return jobSkills.includes(def?.name);
  });

  if (availableCriticals.length === 0) return { hand, deck, discard };

  const forcedSkillId = availableCriticals.shift();
  const skillDef = skills.find((s) => s.id === forcedSkillId);
  const uses = skillDef ? Math.max(0, skillDef.points) : 1;

  // Replace a random card in the hand
  const replaceIndex = Math.floor(Math.random() * hand.length);
  const replaced = hand[replaceIndex];
  if (replaced) discard.push(replaced.id);
  hand[replaceIndex] = { instanceId: hand[replaceIndex]?.instanceId || Date.now(), id: forcedSkillId, uses };

  // Remove the injected card from deck/discard
  deck = deck.filter((id) => id !== forcedSkillId);
  discard = discard.filter((id) => id !== forcedSkillId);

  return { hand, deck, discard };
}

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

  // 🔥 --- CRITICAL HIT CHECK ---
  const isCritical = job.skills?.includes(skillDef.name);
  const damage = isCritical ? Math.ceil(skillDef.power * 2.5) : skillDef.power;

  // apply damage
  const newHp = Math.max(job.hp - damage, 0);
  const updatedJobs = state.jobs.map((j, i) =>
    i === state.currentJobIndex ? { ...j, hp: newHp } : j
  );

  // decrement uses for this instance
  hand[idx].uses = Math.max(0, hand[idx].uses - 1);

  // if uses are 0 -> move to discard and remove from hand
  const discard = [...state.discard];
  let newHand = hand;
  let removedInstance = false;
  if (hand[idx].uses === 0) {
    const [removed] = newHand.splice(idx, 1);
    discard.push(removed.id);
    removedInstance = true;
  }

  // start cooldown for skill definition
  const newCooldowns = {
    ...state.skillCooldowns,
    [skillDef.id]: skillDef.cooldown,
  };

  // draw one card automatically only if we removed a card (replacement)
  let deck = [...state.deck];
  let nextInstanceId = state.nextInstanceId;
  if (removedInstance && newHand.length < 5) {
    if (deck.length === 0 && discard.length > 0) {
      deck = shuffle(discard);
      discard.length = 0;
    }
    if (deck.length > 0) {
      // prefer a card not already in hand
      const handIds = newHand.map((h) => h.id);
      let pickIndex = deck.findIndex((id) => !handIds.includes(id));
      let nextId;
      if (pickIndex === -1) nextId = deck.shift();
      else nextId = deck.splice(pickIndex, 1)[0];
      const skillDef2 = state.skills.find((s) => s.id === nextId);
      const uses = skillDef2 ? Math.max(0, skillDef2.points) : 1;
      newHand.push({ instanceId: nextInstanceId++, id: nextId, uses });
    }
  }

  // logging
  const logEntry = isCritical
    ? `💥 CRITICAL! Used ${skillDef.name} on ${job.title} for ${damage} damage.`
    : `Used ${skillDef.name} on ${job.title} for ${damage} damage.`;

  // if job defeated, award points
  let nextScore = state.score;
  let nextJobsCleared = state.jobsCleared;
  if (newHp <= 0) {
    nextJobsCleared = state.jobsCleared + 1;
    nextScore = state.score + 10; // simple scoring rule
  }

  // Determine if any playable cards remain
  const hasPlayableInHand = newHand.some((h) => h.uses > 0);
  const hasPlayableInPile = (pile) =>
    pile.some((id) => {
      const def = state.skills.find((s) => s.id === id);
      return def && def.points > 0;
    });

  const playableAvailable =
    hasPlayableInHand || hasPlayableInPile(deck) || hasPlayableInPile(discard);

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
    gameOver: !playableAvailable,
    logs: [...state.logs, logEntry].slice(-50),
    nextInstanceId,
    // 🟡 optional: you can store critical state here if you want flare animation
    lastCritical: isCritical,
  };
}


case "NEXT_JOB": {
  const next = state.currentJobIndex + 1;

  // If advancing past last job -> mark run finished and set gameOver
  if (next >= state.jobs.length) {
  return {
  ...state,
  currentEvent: null,
  gameOver: true,         // signal UI to show final screen
  // optionally set currentJobIndex to one past end so currentJob becomes undefined
  currentJobIndex: state.jobs.length,
    };
  }

// otherwise advance to next job
  return { ...state, currentJobIndex: next, currentEvent: null };
}


case "DRAW": {
  const count = action.payload?.count || 1;
  let deck = [...state.deck];
  let hand = [...state.hand];
  let discard = [...state.discard];
  let nextInstanceId = state.nextInstanceId;
  const handLimit = 5;
  const job = state.jobs[state.currentJobIndex];

  for (let i = 0; i < count; i++) {
    if (hand.length >= handLimit) break;
    if (deck.length === 0 && discard.length > 0) {
      deck = shuffle(discard);
      discard = [];
    }
    if (deck.length === 0) break;

    // Prefer drawing a card not already in hand
    const handIds = hand.map((h) => h.id);
    let pickIndex = deck.findIndex((id) => !handIds.includes(id));
    let cardId;
    if (pickIndex === -1) cardId = deck.shift();
    else cardId = deck.splice(pickIndex, 1)[0];

    const skillDef = state.skills.find((s) => s.id === cardId);
    const uses = skillDef ? Math.max(0, skillDef.points) : 1;
    hand.push({ instanceId: nextInstanceId++, id: cardId, uses });
  }

  // ✅ Guarantee at least one critical card in the hand
  ({ hand, deck, discard } = ensureCriticalCard(hand, deck, discard, state.skills, job));

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
        // draw one card into hand (respecting hand limit); reshuffle discard if needed
        let deck = [...newState.deck];
        let discard = [...newState.discard];
        let hand = [...newState.hand];
        let nextInstanceId = newState.nextInstanceId;
        const handLimit = 5;
        if (hand.length < handLimit) {
          if (deck.length === 0 && discard.length > 0) {
            deck = shuffle(discard);
            discard = [];
          }
          if (deck.length > 0) {
              // prefer a card not already in hand
              const handIds = hand.map((h) => h.id);
              let pickIndex = deck.findIndex((id) => !handIds.includes(id));
              let cardId;
              if (pickIndex === -1) cardId = deck.shift();
              else cardId = deck.splice(pickIndex, 1)[0];
            const skillDef = newState.skills.find((s) => s.id === cardId);
            const uses = skillDef ? Math.max(0, skillDef.points) : 1;
            hand.push({ instanceId: nextInstanceId++, id: cardId, uses });
            newState = {
              ...newState,
              deck,
              discard,
              hand,
              nextInstanceId,
              logs: [...newState.logs, `Event drew ${skillDef ? skillDef.name : cardId}`].slice(-50),
            };
          }
        }
        break;
      }
      case "swapSkill": {
        // swap a random hand instance with the top of deck (if possible)
        let deck = [...newState.deck];
        let hand = [...newState.hand];
        let discard = [...newState.discard];
        if (hand.length > 0 && (deck.length > 0 || discard.length > 0)) {
          if (deck.length === 0 && discard.length > 0) {
            deck = shuffle(discard);
            discard = [];
          }
          if (deck.length > 0) {
            const handIdx = Math.floor(Math.random() * hand.length);
            const newCardId = deck.shift();
            const old = hand[handIdx];
            // put old card into discard and replace with new instance
            discard.push(old.id);
            const skillDef = newState.skills.find((s) => s.id === newCardId);
            const uses = skillDef ? Math.max(0, skillDef.points) : 1;
            hand[handIdx] = { instanceId: newState.nextInstanceId, id: newCardId, uses };
            newState = {
              ...newState,
              deck,
              discard,
              hand,
              nextInstanceId: newState.nextInstanceId + 1,
              logs: [...newState.logs, `Event swapped a card in hand`].slice(-50),
            };
          }
        }
        break;
      }
      case "loseSkill": {
        const idx = Math.floor(Math.random() * newState.skills.length);
        const target = newState.skills[idx];
        newState = {
          ...newState,
          skills: newState.skills.map((s, i) => (i === idx ? { ...s, points: Math.max(0, s.points - 1) } : s)),
          logs: [...newState.logs, `Lost 1 point from ${target.name}`].slice(-50),
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

case "RESTART":
  return createInitialState();

case "TIMEOUT": {
  // player failed the current job due to timeout -> deduct points, advance to next job and add a log
  const current = state.jobs[state.currentJobIndex];
  const log = current ? `Timed out on ${current.title}` : `Timed out`;
  const penalty = 5; // points lost on timeout
  const next = state.currentJobIndex + 1;
  const nextState = { ...state, score: Math.max(0, state.score - penalty), logs: [...state.logs, log, `- ${penalty} points`].slice(-50) };
  // Only advance if there is another job. Never set gameOver here.
  if (next < state.jobs.length) {
    return { ...nextState, currentJobIndex: next, currentEvent: null };
  }
  // Already at last job: keep current index, only apply penalty and log.
  return { ...nextState, currentEvent: null };
}

default:
  return state;
}
}

// helper to create a fresh initial state (so RESTART shuffles a new deck)
function createInitialState() {
  let deck = shuffle(skillsData.flatMap((s) => new Array(3).fill(s.id)));
  let discard = [];
  let hand = [];
  let nextInstanceId = 1;

  // Draw 5 cards initially
  for (let i = 0; i < 5; i++) {
    if (deck.length === 0) break;
    const cardId = deck.shift();
    const skillDef = skillsData.find((s) => s.id === cardId);
    const uses = skillDef ? Math.max(0, skillDef.points) : 1;
    hand.push({ instanceId: nextInstanceId++, id: cardId, uses });
  }

  // ✅ Ensure one card matches the first job's required skills
  const firstJob = jobsData[0];
  ({ hand, deck, discard } = ensureCriticalCard(hand, deck, discard, skillsData, firstJob));

  return {
    jobs: jobsData,
    skills: skillsData,
    events: eventsData,
    currentJobIndex: 0,
    currentEvent: null,
    skillCooldowns: {},
    turn: 0,
    gameOver: false,
    score: 0,
    jobsCleared: 0,
    logs: [],
    hand,
    deck,
    discard,
    nextInstanceId,
  };
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
  const triggerEndGame = () => dispatch({ type: "END_GAME" });
  const restartGame = () => dispatch({ type: "RESTART" });
  const drawCards = (count = 1) => dispatch({ type: "DRAW", payload: { count } });
  const discardCard = (instanceId) => dispatch({ type: "DISCARD_CARD", payload: { instanceId } });
  // timeout action
  const [tutorialActive, setTutorialActive] = useState(false);


  return (
    <GameContext.Provider
      value={{
          ...state,
          useSkill,
          nextJob,
          tickCooldowns,
          triggerEvent,
          triggerEndGame,
          tutorialActive,
          setTutorialActive,
          restartGame,
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
