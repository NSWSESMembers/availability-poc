import _ from 'lodash';

import * as bits from '../index';

_.forOwn(bits, (v, k) => {
  test(k, () => {
    expect(v).toBeDefined();
  });
});
