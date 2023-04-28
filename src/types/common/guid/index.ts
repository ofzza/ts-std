// GUID type and factory definition
// ----------------------------------------------------------------------------

/**
 * Single HEX digit type
 */
export type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

/**
 * A utility type checking if type is a string containing only hex characters
 */
// prettier-ignore
export type IsHexString<T extends string> = T extends `${infer THead}${infer TTail}`
  ? (THead extends '' | HexDigit
    ? (TTail extends ''
      ? true : IsHexString<TTail>
    ) : false
  ) : false;

/**
 * A utility type checking if type is a string of a specified length
 */
export type IsStringOfGivenLength<T extends string, N extends number> = _LengthOfString<T> extends N ? true : false;
// Gets length of a const string type
type _LengthOfString<S extends string, T extends string[] = []> = S extends `${string}${infer R}` ? _LengthOfString<R, [...T, string]> : T['length'];

/**
 * A utility type checking if type is a string of a specified length with only hex digits as characters
 */
export type IsHexStringOfGivenLength<T extends string, N extends number> = IsHexString<T> extends true
  ? IsStringOfGivenLength<T, N> extends true
    ? true
    : false
  : false;

/**
 * A utility type chekcing if type is a GUID
 */
// prettier-ignore
export type IsGUID<T extends string> = T extends `${infer A}-${infer B}-${infer C}-${infer D}-${infer E}`
  ? (IsHexStringOfGivenLength<A, 8> extends true
    ? (IsHexStringOfGivenLength<B, 4> extends true
      ? (IsHexStringOfGivenLength<C, 4> extends true
        ? (IsHexStringOfGivenLength<D, 4> extends true
          ? (IsHexStringOfGivenLength<E, 12> extends true
            ? true : false
          ) : false
        ) : false
      ) : false 
    ) : false
  ) : false;

/**
 * Holds a unique, never assignable symbol combining with which makes GUID<T> a unique type
 */
const GuidSymbol = Symbol('NeverGonnaHappen');
/**
 * GUID string type
 */
export type GUID<T> = (T extends `${string & T}` ? (IsGUID<T> extends true ? T : never) : never) | typeof GuidSymbol;
/**
 * GUID generator function, converts a string into a GUID type string, if properly formatted
 * @param id GUID string to check and cast as GUID
 * @returns GUID type if provided with properly formatted string, `never˙type otherwise
 */
export function guid<T extends string>(id: T): IsGUID<T> extends true ? GUID<T> : never {
  return id as IsGUID<T> extends true ? GUID<T> : never;
}
