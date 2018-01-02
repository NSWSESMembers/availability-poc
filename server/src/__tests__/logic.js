import { getHandlers } from '../logic';
import { defineModels } from '../models-mock';
import { getCreators } from '../creators';

const models = defineModels();
const creators = getCreators(models);
const handlers = getHandlers({ models, creators });

it('exists', () => {
  expect(handlers).toBeDefined();
});
