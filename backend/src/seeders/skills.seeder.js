require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Skill = require('../models/Skill.model');
const connectDB = require('../config/db');

const skills = [
  // Programming
  { name: 'Python', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'React', category: 'Programming' },
  { name: 'Node.js', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'C', category: 'Programming' },
  { name: 'SQL', category: 'Programming' },
  { name: 'MongoDB', category: 'Programming' },
  { name: 'HTML & CSS', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Next.js', category: 'Programming' },
  { name: 'Express.js', category: 'Programming' },
  { name: 'Django', category: 'Programming' },
  { name: 'Flask', category: 'Programming' },
  { name: 'Spring Boot', category: 'Programming' },
  { name: 'PHP', category: 'Programming' },
  { name: 'Swift', category: 'Programming' },
  { name: 'Kotlin', category: 'Programming' },
  { name: 'Flutter', category: 'Programming' },
  { name: 'React Native', category: 'Programming' },
  { name: 'Git & GitHub', category: 'Programming' },
  { name: 'Docker', category: 'Programming' },
  { name: 'Linux', category: 'Programming' },
  // Design
  { name: 'Figma', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Photoshop', category: 'Design' },
  { name: 'Illustrator', category: 'Design' },
  { name: 'Canva', category: 'Design' },
  { name: 'Motion Graphics', category: 'Design' },
  { name: 'Video Editing', category: 'Design' },
  // Data Science
  { name: 'Machine Learning', category: 'Data Science' },
  { name: 'Deep Learning', category: 'Data Science' },
  { name: 'Data Analysis', category: 'Data Science' },
  { name: 'TensorFlow', category: 'Data Science' },
  { name: 'Excel', category: 'Data Science' },
  { name: 'Power BI', category: 'Data Science' },
  { name: 'Tableau', category: 'Data Science' },
  // Music
  { name: 'Guitar', category: 'Music' },
  { name: 'Piano', category: 'Music' },
  { name: 'Singing', category: 'Music' },
  { name: 'Music Production', category: 'Music' },
  // Language
  { name: 'English', category: 'Language' },
  { name: 'Hindi', category: 'Language' },
  { name: 'Spanish', category: 'Language' },
  { name: 'French', category: 'Language' },
  { name: 'Japanese', category: 'Language' },
  // Finance
  { name: 'Stock Market', category: 'Finance' },
  { name: 'Personal Finance', category: 'Finance' },
  { name: 'Accounting', category: 'Finance' },
  // Marketing
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'SEO', category: 'Marketing' },
  { name: 'Content Writing', category: 'Marketing' },
  { name: 'Social Media Marketing', category: 'Marketing' },
  { name: 'Public Speaking', category: 'Other' },
  { name: 'Photography', category: 'Other' },
];

const seedSkills = async () => {
  try {
    await connectDB();
    await Skill.deleteMany({});
    await Skill.insertMany(skills);
    console.log(`✅ Successfully seeded ${skills.length} skills`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedSkills();
