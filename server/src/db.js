import Sequelize from 'sequelize';

import { loadTestData } from './test_data/main';
import { defineModels } from './models';
import { getCreators } from './creators';

const init = async ({ db, models }) => {
  // this syncs the database and loads the test data
  // asynchronously
  const creators = getCreators(models);

  await db.sync({ force: true });

  try {
    await loadTestData(creators, models);
    console.log('Finished creating test data');
  } catch (e) {
    console.log('Epic fail while trying to load test data');
    console.log(e);
  }
};

export const setupDb = () => {
  // initialize our database
  const db = new Sequelize('avail', null, null, {
    dialect: 'sqlite',
    storage: './avail.sqlite',
    logging: console.log, // mark this true if you want to see logs
  });

  const models = defineModels(db);
  const setupPromise = init({ db, models });

  return {
    db,
    models,
    setupPromise,
  };
};

export default setupDb;
