// Assertion and Refutal functions
// ----------------------------------------------------------------------------

/**
 * Function allows assertion of:
 *  - A value or expression evaluating as truthy (at runtime)
 *  - Two specified types being equal (at aompile time)
 *  - Value or expression type equals a specified type (at compile time)
 *
 * ### Checking truthiness of a value or expression:
 *
 * By passing an boolean argument to the function (or an expression evaluating to a boolean argument) the assert() function can be used to:
 * - If Jasmine was detected to be present in the execution context: `expect(expression).toBeTrue()`
 * - If Jasmine was not detected, to:
 *   - Fail if the expression evaluates to `false`
 *   - Execute successfuly if expression evaluates to `true`
 *
 * This means the assert() function can be used as a typical assert both within and outside of Jasmine context, as:
 * ```ts
 * // This will work
 * assert(fnThatShouldWorkAndReturnTrue());
 * assert(await asyncFnThatShouldWorkAndReturnTrue());
 * assert(someResult === 'ExpectedValueOfTheResultVariable');
 *
 * // This will fail at run time
 * assert(!fnThatShouldWorkAndReturnTrue());
 * assert(!(await asyncFnThatShouldWorkAndReturnTrue()));
 * assert(someResult === 'NotAllowedValueOfTheResultVariable');
 * ```
 *
 * ### Checking that a value matches a type:
 *
 * If the first generic parameter is found to have been explicitly set, and function arguments we passed, the assert() function will return a type checking
 * function typed to the first generic parameter. In this way, you can write compile-time checks verifying typing of values or methods:
 *
 * ```ts
 * // A custom, typed function used to lowercase property keys of type strings and not change if type number or symbol
 * const lowercaseKey = <T extends string | number | symbol>(key: T): T => (typeof key === 'string' ? (key.toLowerCase() as T) : key);
 *
 * // This will work
 * assert<string>()(lowercaseKey('myProperty'));
 * assert<number>()(lowercaseKey(123));
 * assert<symbol>()(lowercaseKey(Symbol('myProperty')));
 *
 * // This will fail at compile time
 * assert<string>()(lowercaseKey(123));
 * assert<string>()(lowercaseKey(Symbol('myProperty')));
 * ```
 *
 * ### Comparison of two types:
 *
 * By using both of the generic parameters, the assert() function can be used to check a custom type matching some other type. In this way, you can
 * write compile-time checks verifying functionality of TS utility types:
 * ```ts
 * // This will work
 * assert<'ABC', Uppercase<'abc'>>;
 * assert<'ABC', Uppercase<string>>;
 * assert<never, Uppercase<never>>;
 *
 * // This will fail at compile time
 * assert<'abc', Uppercase<'abc'>>;
 * assert<'abc', Uppercase<string>>;
 * assert<null, Uppercase<string>>;
 * ```
 *
 * @template TAssertion The type all the assertions are being made about
 * @template TComparison (Optional) Secondary type, being compared to `TAssertion` type
 * @param expression (Optional) Expression to evaluate (at runtime) and assert evaluated value being truthy
 * @throws 'Assertion failed!' error if passed a false asserted expression
 * @throws 'Assertion needs to be a evaluated as a boolean value!' error if passed asserted expression of a non-boolean type
 * @returns Function only accepting a value of provided generic `TAssertion` type. If a different type value or expression
 * is provided there will be a (compile time) error thrown. This allows for (compile time) assertion of types matching expected values.
 */
export function assert<TAssertion, TComparison extends TAssertion = TAssertion>(expression?: boolean): (assertion: TAssertion) => void {
  // If assertion defined, check assertion
  if (expression !== undefined) {
    // If jasmine injected into global scope, use jasmine's expectation to validate truthiness
    if ('jasmine' in globalThis && 'expect' in globalThis) {
      (globalThis as any).expect(expression).toBeTrue();
    }
    // ... else, check assertion and throw error if assertion broken
    else if (expression === true) {
    }
    // ... else, check assertion and throw error if assertion broken
    else if (expression === false) throw new Error('Assertion failed!');
    // ... else, check assertion is evaluated as boolean
    else if (expression !== undefined) throw new Error('Assertion needs to be a evaluated as a boolean value!');
  }

  /**
   * Asserts that the provided value's or expression's type matches the provided `TAssertion` generic parameter type. If a different type value or expression
   * is provided there will be a (compile time) error thrown. This allows for (compile time) assertion of types matching expected values.
   * @param assertion Value or expression to assert the type of (at compile time)
   */
  const valueTypeAssertionFn = function (assertion: TAssertion): void {};
  // Return function for (compile time) type assertion
  return valueTypeAssertionFn;
}

/**
 * Function allows refutation of:
 *  - Value or expression type equals a specified type (at compile time)
 *  - A value or expression evaluating as truthy (at runtime)
 *
 * ### Checking truthiness of a value or expression:
 *
 * By passing an boolean argument to the function (or an expression evaluating to a boolean argument) the refute() function can be used to:
 * - If Jasmine was detected to be present in the execution context: `expect(expression).toBeFalse()`
 * - If Jasmine was not detected, to:
 *   - Fail if the expression evaluates to `true`
 *   - Execute successfuly if expression evaluates to `false`
 *
 * This means the refute() function can be used as a reverse of a typical assert both within and outside of Jasmine context, as:
 * ```ts
 * // This will work
 * refute(fnThatShouldWorkAndReturnFalse());
 * refute(await asyncFnThatShouldWorkAndReturnFalse());
 * refute(someResult === 'NotAllowedValueOfTheResultVariable');
 *
 * // This will fail at run time
 * refute(!fnThatShouldWorkAndReturnFalse());
 * refute(!(await asyncFnThatShouldWorkAndReturnFalse()));
 * refute(someResult === 'ExpectedValueOfTheResultVariable');
 * ```
 *
 * ### Checking that a value mismatches a type:
 *
 * If the first generic parameter is found to have been explicitly set, and function arguments we passed, the refute() function will return a type checking
 * function typed to the first generic parameter. In this way, you can write compile-time checks refuting typing of values or methods:
 *
 * ```ts
 * // A custom, typed function used to lowercase property keys of type strings and not change if type number or symbol
 * const lowercaseKey = <T extends string | number | symbol>(key: T): T => (typeof key === 'string' ? (key.toLowerCase() as T) : key);
 *
 * // This will work
 * refute<string>()(lowercaseKey(123));
 * refute<string>()(lowercaseKey(Symbol('myProperty')));
 *
 * // This will fail at compile time
 * refute<string>()(lowercaseKey('myProperty'));
 * refute<number>()(lowercaseKey(123));
 * refute<symbol>()(lowercaseKey(Symbol('myProperty')));
 * ```
 *
 * @template TRefutation The type all the refutations are being made about
 * @throws 'Refutation failed!' error if passed a false refuted expression
 * @throws 'Refutation needs to be a evaluated as a boolean value!' error if passed refuted expression of a non-boolean type
 * @param expression (Optional) Expression to evaluate (at runtime) and refute evaluated value being truthy (assert being falsy)
 * @returns Function only accepting a value of type different from provided generic `TRefutation` type. If matching type value or expression
 * is provided there will be a (compile time) error thrown. This allows for (compile time) refutation of types matching expected values (assetion of mismatching).
 */
export function refute<TRefutation>(expression?: boolean): <T>(refutation: T extends TRefutation ? never : T) => void {
  // If assertion defined, check assertion
  if (expression !== undefined) {
    // If jasmine injected into global scope, use jasmine's expectation to validate falsiness
    if ('jasmine' in globalThis && 'expect' in globalThis) {
      (globalThis as any).expect(expression).toBeFalse();
    }
    // ... else if refutation passing, continue
    else if (expression === false) {
    }
    // ... else, check refutation and throw error if refutation broken
    else if (expression === true) throw new Error('Refutation failed!');
    // ... else, check assertion is evaluated as boolean
    else if (expression !== undefined) throw new Error('Refutation needs to be a evaluated as a boolean value!');
  }

  /**
   * Refutes that the provided value's or expression's type matches the provided `TAssertion` generic parameter type (asserts a mismatch).
   * If matching type value or expression is provided there will be a (compile time) error thrown. This allows for (compile time) refutation of types matching
   * expected values (assetion of mismatching).
   * @param refutation Value or expression to refute the type of (at compile time)
   */
  const valueTypeRefutationFn = function <T>(refutation: T extends TRefutation ? never : T): void {};
  // Return function for (compile time) type refutation
  return valueTypeRefutationFn;
}
