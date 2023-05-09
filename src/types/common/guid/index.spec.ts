// GUID type and factory definition tests
// ----------------------------------------------------------------------------

// Import dependencies
import * as root from '../../../';
import { assert, refute } from '../../utility/assertion';
import { HexDigit, IsHexString, IsStringOfGivenLength, IsHexStringOfGivenLength, IsGUID, GUID, isguid, guid } from './';

describe('GUID type and factory definitions are exported from the library root', () => {
  it('GUID type', () => {
    // Exported
    assert<root.GUID>;
    // Empty runtime assert for jasmine
    assert();
  });
  it('isguid() function', () => {
    // Exported
    assert(!!root.isguid);
  });
  it('guid() function', () => {
    // Exported
    assert(!!root.guid);
  });
});

describe('HexDigit: Single HEX digit type', () => {
  it('Compile time checks', () => {
    // Valid
    assert<HexDigit>()('0');
    assert<HexDigit>()('a');
    assert<HexDigit>()('A');
    // Invalid
    refute<HexDigit>()('!');
    refute<HexDigit>()('g');
    refute<HexDigit>()('G');
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('IsHexString<T>: A utility type checking if type is a string containing only hex characters', () => {
  it('Compile time checks', () => {
    // Valid
    assert<IsHexString<'1234567890abcdefABCDEF'>, true>;
    // Invalid
    assert<IsHexString<'!'>, false>;
    assert<IsHexString<'g'>, false>;
    assert<IsHexString<'G'>, false>;
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('IsStringOfGivenLength<T, N>: A utility type checking if type is a string of a specified length', () => {
  it('Compile time checks', () => {
    assert<IsStringOfGivenLength<'1', 1>, true>; // Valid
    assert<IsStringOfGivenLength<'12', 1>, false>; // Invalid: long
    assert<IsStringOfGivenLength<'123', 3>, true>; // Valid
    assert<IsStringOfGivenLength<'1234', 3>, false>; // Invalid: long
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('IsHexStringOfGivenLength<T, N>: A utility type checking if type is a string of a specified length with only hex digits as characters', () => {
  it('Compile time checks', () => {
    assert<IsHexStringOfGivenLength<'1', 1>, true>; // Valid
    assert<IsHexStringOfGivenLength<'!', 1>, false>; // Invallid characters
    assert<IsHexStringOfGivenLength<'12', 1>, false>; // Invalid length: long
    assert<IsHexStringOfGivenLength<'12', 3>, false>; // Invalid length: short
    assert<IsHexStringOfGivenLength<'123', 3>, true>; // Valid
    assert<IsHexStringOfGivenLength<'!23', 3>, false>; // Invalid chars
    assert<IsHexStringOfGivenLength<'1234', 3>, false>; // Invalid length: long
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('IsGUID<T>: A utility type chekcing if type is a GUID', () => {
  it('Compile time checks', () => {
    // Valid GUID
    assert<IsGUID<'12345678-1234-1234-1234-12345678abcd'>, true>;
    assert<IsGUID<'1234567-1234-1234-1234-12345678abcd'>, false>;
    // Invalid GUID
    assert<IsGUID<'123456789-1234-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-123-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-12345-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-123-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-12345-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-123-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-12345-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-1234-12345678abc'>, false>;
    assert<IsGUID<'12345678-1234-1234-1234-12345678abcde'>, false>;
    assert<IsGUID<'123456781234-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-12341234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-12341234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-123412345678abcd'>, false>;
    assert<IsGUID<'!2345678-1234-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-!234-1234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-!234-1234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-!234-12345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-1234-!2345678abcd'>, false>;
    assert<IsGUID<'12345678-1234-1234-1234-12345678abcd-a'>, false>;
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('isguid(): GUID runtime validation function', () => {
  it('Runtime checks', () => {
    // Valid GUID will pass run-time validation
    assert(isguid('12345678-1234-1234-1234-12345678abcd'));
    // Invalid GUID will fail run-time validation
    assert(!isguid('!2345678-1234-1234-1234-12345678abcd'));
  });
});

describe('GUID: GUID string type and guid() factory function', () => {
  it('Compile time checks', () => {
    // Empty runtime assert for jasmine
    assert();
    // No need to execute compile-time checks
    if (true === true) return;
    // Valid GUID is compile-time validated and cast as GUID
    assert<string>()(guid('12345678-1234-1234-1234-12345678abcd'));
    assert<GUID>()(guid('12345678-1234-1234-1234-12345678abcd'));
    // Invalid GUID is compile-time invalidated and cast as string
    assert<string>()(guid('!2345678-1234-1234-1234-12345678abcd'));
    refute<GUID>()(guid('!2345678-1234-1234-1234-12345678abcd'));
    // Non-literal GUID can't be compile-time validated and is assumed to be GUID
    const _guid: string = '12345678-1234-1234-1234-12345678abcd';
    assert<string>()(guid(_guid));
    assert<GUID>()(guid(_guid));
  });
  it('Runtime checks', () => {
    // Valid GUID will pass run-time validation
    expect(() => guid('12345678-1234-1234-1234-12345678abcd')).not.toThrow();
    // Invalid GUID will fail run-time validation
    expect(() => guid('!2345678-1234-1234-1234-12345678abcd')).toThrow();
  });
});
