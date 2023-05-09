// Assertion and Refutal functions tests
// ----------------------------------------------------------------------------

// Import dependencies
import * as root from '../../../';
import { assert, refute } from './';

describe('Assertion functions are exported from the library root', () => {
  it('assert() function', () => {
    assert(!!root.assert);
  });
  it('refute() function', () => {
    assert(!!root.refute);
  });
});
