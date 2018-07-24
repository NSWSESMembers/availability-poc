// need this for async/await
import 'babel-polyfill';
import { setupDb } from '../db';

const { setupPromise } = setupDb({ force: true });

setupPromise.then(() => {
  console.log('Setup done');
  process.exit();
});

