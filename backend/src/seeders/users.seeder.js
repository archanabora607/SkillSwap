require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User.model');
const Skill = require('../models/Skill.model');

const seedUsers = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding demo users...');

    // Fetch some skills from DB
    const python = await Skill.findOne({ name: /Python/i });
    const react = await Skill.findOne({ name: /React/i });
    const node = await Skill.findOne({ name: /Node/i });
    const sql = await Skill.findOne({ name: /SQL/i });
    const ui = await Skill.findOne({ name: /Figma/i }) || await Skill.findOne({ category: 'Design' });

    if (!python || !react) {
      console.error('⚠️ Skills not found. Run skills seeder first!');
      process.exit(1);
    }

    // Delete existing test users if any
    await User.deleteMany({ email: { $in: ['alice@university.edu', 'bob@university.edu', 'charlie@university.edu'] } });

    const demoUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice@university.edu',
        password: 'password123',
        college: 'State University',
        department: 'Computer Science',
        year: 3,
        bio: 'Frontend enthusiast loving React & UI design. Eager to learn Python data analysis!',
        skillsToTeach: [
          { skill: react._id, level: 'advanced' },
          { skill: node._id ? node._id : react._id, level: 'intermediate' },
        ],
        skillsToLearn: [
          { skill: python._id, priority: 'high' },
          { skill: sql ? sql._id : python._id, priority: 'medium' },
        ],
        rating: { average: 4.9, count: 12 },
        completedSessions: 8,
      },
      {
        name: 'Bob Smith',
        email: 'bob@university.edu',
        password: 'password123',
        college: 'State University',
        department: 'Data Science',
        year: 2,
        bio: 'Python & SQL backend developer wanting to master React frontend architecture.',
        skillsToTeach: [
          { skill: python._id, level: 'advanced' },
          { skill: sql ? sql._id : python._id, level: 'advanced' },
        ],
        skillsToLearn: [
          { skill: react._id, priority: 'high' },
          { skill: node ? node._id : react._id, priority: 'medium' },
        ],
        rating: { average: 4.8, count: 9 },
        completedSessions: 6,
      },
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save(); // triggers pre-save password hash
      console.log(`✅ Seeded user: ${user.name} (${user.email})`);
    }

    console.log('🎉 Demo users successfully seeded into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ User seeder error:', error);
    process.exit(1);
  }
};

seedUsers();
