// src/data/data.js

export const skillsData = [
  /* === HARD SKILLS (points: low -> high) === */
  { id: 0, 
    name: "SQL", 
    power: 3, points: 2, type: "hard", cooldown: 3, 
    description: "Extract and analyze insights from databases." },
  
  { id: 1, 
    name: "Debugging", 
    power: 2, points: 2, type: "hard", cooldown: 1, 
    description: "Find and fix issues efficiently." },
  
  { id: 2, 
    name: "React", 
    power: 3, points: 2, type: "hard", cooldown: 3, 
    description: "Build responsive UIs with reusable components." },
  
  { id: 3, 
    name: "Python", 
    power: 3, points: 3, type: "hard", cooldown: 2, 
    description: "Write powerful scripts to process data fast." },
  
  { id: 4, 
    name: "Excel", 
    power: 2, 
    points: 3, 
    type: "hard", 
    cooldown: 2, 
    description: "Analyze data and create reports efficiently." },
  
  { id: 5, 
    name: "Problem Solving", 
    power: 3, 
    points: 3, 
    type: "hard", 
    cooldown: 2, 
    description: "Break down complex problems and produce solutions." },
  
  { id: 6, 
    name: "JavaScript", 
    power: 2, 
    points: 3, 
    type: "hard", 
    cooldown: 2, 
    description: "Create interactive web features and logic." },
  
  { id: 7, 
    name: "Data Visualization", 
    power: 2, 
    points: 3, 
    type: "hard", 
    cooldown: 2, 
    description: "Present data clearly using charts and visuals." },
  
  { id: 8, 
    name: "Git", 
    power: 1, 
    points: 4, 
    type: "hard", 
    cooldown: 1, 
    description: "Manage source control and collaborate on code." },

  /* === SOFT SKILLS (points: low -> high) === */
  { id: 9, 
    name: "Leadership", 
    power: 2, 
    points: 2, 
    type: "soft", 
    cooldown: 2, 
    description: "Guide teams and make strategic decisions." },
  
  { id: 10, 
    name: "Presentation", 
    power: 1, 
    points: 2, 
    type: "soft", 
    cooldown: 1, 
    description: "Deliver ideas clearly to groups and stakeholders." },
  { id: 11, name: "Teamwork", power: 1, points: 3, type: "soft", cooldown: 1, description: "Collaborate with peers to solve problems." },
  { id: 12, name: "Time Management", power: 1, points: 3, type: "soft", cooldown: 1, description: "Prioritize tasks and meet deadlines." },
  { id: 13, name: "Negotiation", power: 2, points: 3, type: "soft", cooldown: 2, description: "Find win-win outcomes and influence decisions." },
  { id: 14, name: "Communication", power: 1, points: 4, type: "soft", cooldown: 1, description: "Convey ideas clearly and build trust." }
];

export const jobsData = [
  // Entry-Level (low to high HP)
  { id: 0, title: "UX Designer", hp: 7, maxHp: 7, tier: "Entry-Level", skills: ["Communication", "Teamwork", "React"] },
  { id: 1, title: "Data Analyst", hp: 8, maxHp: 8, tier: "Entry-Level", skills: ["SQL", "Excel", "Data Visualization"], description: "Collects and analyzes data to inform business decisions." },

  // Junior (low to high HP)
  { id: 2, title: "QA Engineer", hp: 7, maxHp: 7, tier: "Junior", skills: ["Teamwork", "Time Management", "Communication"], description: "Tests software to ensure quality and reliability." },
  { id: 3, title: "Business Analyst", hp: 9, maxHp: 9, tier: "Junior", skills: ["Presentation", "Problem Solving", "SQL"], description: "Translates business needs into technical requirements." },

  // Intermediate (low to high HP)
  { id: 4, title: "Marketing Specialist", hp: 6, maxHp: 6, tier: "Intermediate", skills: ["Leadership", "Teamwork", "Excel"], description: "Creates campaigns that engage customers and drive growth." },
  { id: 5, title: "Product Manager", hp: 8, maxHp: 8, tier: "Intermediate", skills: ["Data Visualization", "Problem Solving", "Excel"], description: "Defines product vision and coordinates cross-functional teams." },

  // Mid-Level (low to high HP)
  { id: 6, title: "Software Engineer", hp: 10, maxHp: 10, tier: "Mid-Level", skills: ["Python", "JavaScript", "Git"], description: "Designs and builds software features and services." },
  { id: 7, title: "DevOps Engineer", hp: 11, maxHp: 11, tier: "Mid-Level", skills: ["Python", "SQL", "Teamwork"], description: "Maintains infrastructure and deployment pipelines." },

  // Senior (low to high HP)
  { id: 8, title: "Data Scientist", hp: 12, maxHp: 12, tier: "Senior", skills: ["Python", "SQL", "Communication"], description: "Builds models to extract insights and predict outcomes." },
  { id: 9, title: "Systems Architect", hp: 14, maxHp: 14, tier: "Senior", skills: ["Python", "SQL", "Teamwork"], description: "Architects scalable systems and defines technical standards." },

  // Lead
  { id: 10, title: "Technical Lead", hp: 13, maxHp: 13, tier: "Lead", skills: ["Python", "Communication", "Teamwork"], description: "Leads engineering teams to deliver complex projects." },

  // Executive
  { id: 11, title: "CTO", hp: 18, maxHp: 18, tier: "Executive", skills: ["Communication", "Teamwork", "Python"], description: "Drives technical strategy and guides company technology." }
];

export const eventsData = [
  /* === BENEFICIAL EVENTS === */
  { id: 0, title: "Online Course", effect: "drawSkill", description: "Gain an extra skill card." },
  { id: 1, title: "Mentorship", effect: "drawSkill", description: "A mentor shares knowledge — gain a skill point." },
  { id: 2, title: "Conference", effect: "drawSkill", description: "Attend a conference — gain +1 point to a random skill." },
  { id: 3, title: "Practice Session", effect: "healSkillPoints", description: "Restore 1 point to each skill." },

  /* === NEUTRAL EVENTS === */
  { id: 4, title: "Networking Event", effect: "swapSkill", description: "Swap one skill for a random one from deck." },
  { id: 5, title: "Recruiter Suggestion", effect: "swapSkill", description: "Opportunity to swap a skill for a different one." },

  /* === HARMFUL EVENTS === */
  { id: 6, title: "Bad Interview", effect: "loseSkill", description: "Lose one random skill point." },
  { id: 7, title: "Buggy Release", effect: "loseSkill", description: "A bad release costs team credibility — lose skill points." },
  { id: 8, title: "Workshop Mishap", effect: "drawSkill", description: "Workshop went sideways but you still picked up a trick (minor)." }
];
