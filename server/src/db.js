import Sequelize from 'sequelize';

import { loadTestData } from './test-data/load';
import { defineModels } from './models';
import { getCreators } from './creators';

const init = async ({ db, models }) => {
  // this syncs the database and loads the test data
  // asynchronously
  const creators = getCreators(models);

  await db.sync({ force: true });

  try {
    await loadTestData(creators);
    console.log('Finished creating test data'); // eslint-disable-line no-console
  } catch (e) {
    console.log('Epic fail while trying to load test data'); // eslint-disable-line no-console
    console.log(e); // eslint-disable-line no-console
  }
};

export const setupDb = () => {
  // initialize our database
  const db = new Sequelize('avail', null, null, {
    dialect: 'sqlite',
    storage: './avail.sqlite',
    logging: console.log, // eslint-disable-line no-console
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
