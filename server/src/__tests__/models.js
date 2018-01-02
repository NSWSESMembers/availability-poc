import Sequelize from 'sequelize';
import { defineModels } from '../models';

const db = new Sequelize('test', null, null, {
  dialect: 'sqlite',
  storage: './avail.sqlite',
});

it('models defined', () => {
  const models = defineModels(db);
  expect(models).toBeDefined();
});
