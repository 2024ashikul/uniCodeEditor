const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging : false
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT || 'postgres',
//     port: process.env.DB_PORT || 5432,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     },
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // for testing only
//       },
//     },
//     logging: console.log,
//   }
// );



const User = require('./users.js')(sequelize, DataTypes);
const Admin = require('./admin.js')(sequelize, DataTypes);
const Rooms = require('./rooms.js')(sequelize, DataTypes);
const RoomMembers = require('./roomMember.js')(sequelize, DataTypes)
const Assessment = require('./assessment.js')(sequelize, DataTypes);
const Submission = require('./submissions.js')(sequelize, DataTypes);
const Problem = require('./problems.js')(sequelize, DataTypes)
const Announcement = require('./announcements.js')(sequelize, DataTypes)
const Lesson = require('./lesson.js')(sequelize, DataTypes);
const LessonM = require('./lessons.js');
const Meeting = require('./meetings.js')(sequelize, DataTypes);
const Material = require('./material.js')(sequelize,DataTypes);

User.hasMany(Rooms, { foreignKey: 'admin' })
Rooms.belongsTo(User, { foreignKey: 'admin' })

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

Assessment.belongsTo(Rooms, { foreignKey: 'roomId' });
Rooms.hasMany(Assessment, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Lesson.belongsTo(Rooms, { foreignKey: 'roomId' });
Rooms.hasMany(Lesson, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

RoomMembers.belongsTo(User, { foreignKey: 'userId' ,onDelete: 'CASCADE', onUpdate: 'CASCADE' });
RoomMembers.belongsTo(Rooms, { foreignKey: 'roomId' ,onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Submission.belongsTo(Problem, { foreignKey: 'problemId' })
Problem.hasMany(Submission, { foreignKey: 'problemId' })

Submission.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Submission, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

Announcement.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Announcement, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })


Assessment.hasMany(Problem, { foreignKey: 'assessmentId' })
Problem.belongsTo(Assessment, { foreignKey: 'assessmentId' })

User.hasMany(Assessment, { foreignKey: 'userId' })
Assessment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

User.hasMany(Material, { foreignKey: 'userId' })
Material.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

Rooms.hasMany(Material, { foreignKey: 'roomId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
Material.belongsTo(Rooms, { foreignKey: 'roomId' })

module.exports = { sequelize, User, Admin, Rooms, RoomMembers, Assessment, Submission, Problem, Announcement, Lesson, LessonM, Meeting ,Material};

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected!');

//   } catch (error) {
//     console.error('Unable to connect:', error);
//   }
// })();

