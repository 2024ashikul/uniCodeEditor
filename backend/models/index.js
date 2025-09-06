const { Sequelize, DataTypes } = require('sequelize');
const assignment = require('./assignment.js');
const lessons = require('./lessons.js');
require('dotenv').config();

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite'
// });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // for testing only
      },
    },
    logging: console.log,
  }
);



const User = require('./users.js')(sequelize, DataTypes);
const Admin = require('./admin.js')(sequelize, DataTypes);
const Rooms = require('./rooms.js')(sequelize, DataTypes);
const RoomMembers = require('./roomMember.js')(sequelize, DataTypes)
const Assignment = require('./assignment.js')(sequelize, DataTypes);
const Submission = require('./submissions.js')(sequelize, DataTypes);
const Problem = require('./problems.js')(sequelize, DataTypes)
const Announcement = require('./announcements.js')(sequelize, DataTypes)
const Lesson = require('./lesson.js')(sequelize, DataTypes);
const LessonM = require('../models/lessons');
const Meeting = require('./meetings.js')(sequelize, DataTypes);

User.hasMany(Rooms, { foreignKey: 'userId' })
Rooms.belongsTo(User, { foreignKey: 'userId' })



User.belongsToMany(Rooms, {
  through: RoomMembers,
  foreignKey: 'userId',
  otherKey: 'roomId'
})

Rooms.belongsToMany(User, {
  through: RoomMembers,
  foreignKey: 'roomId',
  otherKey: 'userId'
})

Rooms.hasMany(Announcement, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
Announcement.belongsTo(Rooms, { foreignKey: 'roomId' })

Assignment.belongsTo(Rooms, { foreignKey: 'roomId' });
Rooms.hasMany(Assignment, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Lesson.belongsTo(Rooms, { foreignKey: 'roomId' });
Rooms.hasMany(Lesson, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

RoomMembers.belongsTo(User, { foreignKey: 'userId' });
RoomMembers.belongsTo(Rooms, { foreignKey: 'roomId' });

Submission.belongsTo(Problem, { foreignKey: 'problemId' })
Problem.hasMany(Submission, { foreignKey: 'problemId' })

Submission.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Submission, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

Assignment.hasMany(Problem, { foreignKey: 'assignmentId' })
Problem.belongsTo(Assignment, { foreignKey: 'assignmentId' })

module.exports = { sequelize, User, Admin, Rooms, RoomMembers, Assignment, Submission, Problem, Announcement, Lesson, LessonM, Meeting };

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Unable to connect:', error);
  }
})();

