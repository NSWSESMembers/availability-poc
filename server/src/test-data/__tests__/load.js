import { loadTestData } from '../load';
import { defineModels } from '../../models-mock';
import { getCreators } from '../../creators';

const models = defineModels();
const creators = getCreators(models);

it('succeeds', async () => {
  await loadTestData(creators);
});
