import Sequelize from 'sequelize';

const init = async ({ logDb, logModel }) => {
  await logDb.sync({ force: true });

  try {
    await logModel.create({ source: 'core', action: 'Startup' });
    console.log('Finished creating log database'); // eslint-disable-line no-console
  } catch (e) {
    console.log('Epic fail creating log database'); // eslint-disable-line no-console
    console.log(e); // eslint-disable-line no-console
  }
};

export const setupLogger = () => {
  // initialize our database
  const logDb = new Sequelize('avail-logger', null, null, {
    dialect: 'sqlite',
    storage: './avail.log.sqlite',
    logging: console.log, // eslint-disable-line no-console
  });

  const logModel = logDb.define('log', {
    source: { type: Sequelize.STRING },
    action: { type: Sequelize.STRING },
    payload: { type: Sequelize.STRING },
  });

  init({ logDb, logModel });

  const logWriter = ({
    source,
    action,
    payload,
  }) => logModel.create({
    source,
    action,
    payload: JSON.stringify(payload),
  });

  return {
    logWriter,
  };
};

export default setupLogger;
