// src/data/data.js

export const skillsData = [
  { id: 0, name: "Python", power: 3, points: 3, type: "hard", cooldown: 2, description: "Write powerful scripts to process data fast." },
  { id: 1, name: "Excel", power: 2, points: 3, type: "hard", cooldown: 2, description: "Analyze data and create reports efficiently." },
  { id: 2, name: "Communication", power: 1, points: 4, type: "soft", cooldown: 1, description: "Convey ideas clearly and build trust." },
  { id: 3, name: "Teamwork", power: 1, points: 3, type: "soft", cooldown: 1, description: "Collaborate with peers to solve problems." },
  { id: 4, name: "SQL", power: 3, points: 2, type: "hard", cooldown: 3, description: "Extract and analyze insights from databases." }
];

export const jobsData = [
  { id: 0, title: "Data Analyst", hp: 8, maxHp: 8, tier: "Entry-Level", skills: ["Python", "Excel", "Communication"] },
  { id: 1, title: "Marketing Specialist", hp: 6, maxHp: 6, tier: "Intermediate", skills: ["Communication", "Teamwork", "Excel"] },
  { id: 2, title: "Software Engineer", hp: 10, maxHp: 10, tier: "Mid-Level", skills: ["Python", "SQL", "Teamwork"] }
];

export const eventsData = [
  { id: 0, title: "Online Course", effect: "drawSkill", description: "Gain an extra skill card." },
  { id: 1, title: "Networking Event", effect: "swapSkill", description: "Swap one skill for a random one from deck." },
  { id: 2, title: "Bad Interview", effect: "loseSkill", description: "Lose one random skill point." },
  { id: 3, title: "Practice Session", effect: "healSkillPoints", description: "Restore 1 point to each skill." }
];
