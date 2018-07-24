import Sequelize from 'sequelize';

import { loadTestData } from './test-data/load';
import { defineModels } from './models';
import { getCreators } from './creators';
import { isDev } from './utils';

const init = async ({ db, models, force } = {}) => {
  // this syncs the database and loads the test data
  // asynchronously
  const creators = getCreators(models);
  const shouldForce = isDev() || force;

  // drop and recreate tables if we're on dev
  await db.sync({ force: shouldForce });

  // load the test data if we're dev, otherwise this will be done manually
  // by an operator
  if (shouldForce) {
    try {
      await loadTestData(creators);
      console.log('Finished creating test data'); // eslint-disable-line no-console
    } catch (e) {
      console.log('Epic fail while trying to load test data'); // eslint-disable-line no-console
      console.log(e); // eslint-disable-line no-console
    }
  }
};

export const setupDb = ({ force } = {}) => {
  // initialize our database
  let db;
  if (process.env.HEROKU_POSTGRESQL_BROWN_URL) {
    db = new Sequelize(process.env.HEROKU_POSTGRESQL_BROWN_URL, {
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: console.log, // eslint-disable-line no-console
    });
  } else {
    db = new Sequelize('avail', null, null, {
      dialect: 'sqlite',
      storage: './avail.sqlite',
      logging: console.log, // eslint-disable-line no-console
    });
  }

  const models = defineModels(db);
  const setupPromise = init({ db, models, force });

  return {
    db,
    models,
    setupPromise,
  };
};

export default setupDb;
