// Assertion and Refutal functions tests
// ----------------------------------------------------------------------------

// Import dependencies
import * as root from '../../../';
import { assert, _assert, refute, _refute } from './';

describe('Assertion functions', () => {
  describe('Assertion functions are exported from the library root', () => {
    it('assert() function', () => {
      expect('assert' in root).toBeTrue();
      expect('_assert' in root).toBeFalse();
    });
    it('refute() function', () => {
      expect('refute' in root).toBeTrue();
      expect('_refute' in root).toBeFalse();
    });
  });

  describe('assert<TAssertion, TComparison>() function works as expected', () => {
    it('Runtime assertion: assert(expression: boolean)', () => {
      expect(() => _assert((1 as number) === (1 as number), false)).not.toThrow();
      expect(() => _assert((0 as number) === (1 as number), false)).toThrow();
      expect(() => _assert('not a boolean' as unknown as boolean, false)).toThrow();
    });

    it('Value type assertion: assert<T>()(expression: T)', () => {
      assert(true);

      assert<boolean>()(true);
      assert<boolean>()(false);
      var assertFnBoolean = assert<boolean>();
      assert<Parameters<typeof assertFnBoolean>, [boolean]>;

      assert<string>()('abc');
      var assertFnString = assert<string>();
      assert<Parameters<typeof assertFnString>, [string]>;

      assert<number>()(123);
      var assertFnNumber = assert<number>();
      assert<Parameters<typeof assertFnNumber>, [number]>;
    });

    it('Type equality assertion: assert<T1, T2>', () => {
      // assert<string, number>; // Not allowed, but unable to test
      assert<string, string>;
      assert<string, Uppercase<'abc'>>;
    });
  });

  describe('refute<TRefutation>() function works as expected', () => {
    it('Runtime assertion: refute(expression: boolean)', () => {
      expect(() => _refute((0 as number) === (1 as number), false)).not.toThrow();
      expect(() => _refute((1 as number) === (1 as number), false)).toThrow();
      expect(() => _refute('not a boolean' as unknown as boolean, false)).toThrow();
    });

    it('Value type assertion: refute<T>()(expression: T)', () => {
      refute(false);

      refute<boolean>()(123);
      refute<boolean>()('abc');
      var refuteFnBoolean = refute<boolean>();
      assert<Parameters<typeof refuteFnBoolean>, [boolean]>;

      refute<string>()(true);
      refute<string>()(123);
      var refuteFnString = refute<string>();
      assert<Parameters<typeof refuteFnString>, [string]>;

      refute<number>()(true);
      refute<number>()('abc');
      var refuteFnNumber = refute<number>();
      assert<Parameters<typeof refuteFnNumber>, [number]>;
    });
  });
});
