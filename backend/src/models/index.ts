import sequelize from '../../config/database';
import { User } from './user.model';

import { Room } from './room.model';
import { RoomMember } from './roommember.model';
import { Assessment } from './assessment.model';
import { Submission } from './submission.model';
import { Problem } from './problem.model';
import { Announcement } from './announcement.model';
import { LessonM } from './lessonM.model';
import { LessonContent } from './lessonContent.model';
import { Meeting } from './meeting.model';
import { Material } from './material.model'


const models = {
  User,
  Room,
  RoomMember,
  Assessment,
  Submission,
  Problem,
  Announcement,
  LessonM,
  LessonContent,
  Meeting,
  Material,
};


for (const model of Object.values(models)) {
  model.initialize(sequelize);
}


for (const model of Object.values(models)) {
  if (model.associate) {
    model.associate(models);
  }
}


export const db = {
  sequelize,
  ...models,
};


export const syncDB = async () => {
  await sequelize.sync({ alter: true }); // { force: true } to drop and recreate tables
  console.log('Database synchronized!');
};