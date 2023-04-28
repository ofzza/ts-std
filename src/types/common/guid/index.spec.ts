// GUID type and factory definition tests
// ----------------------------------------------------------------------------

// Import dependencies
import { assert, refute } from '../../utility/assertion';
import { HexDigit, IsHexString, IsStringOfGivenLength, IsHexStringOfGivenLength, IsGUID, GUID, guid } from '../guid';

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

describe('IsHexString: A utility type checking if type is a string containing only hex characters', () => {
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

describe('IsStringOfGivenLength: A utility type checking if type is a string of a specified length', () => {
  it('Compile time checks', () => {
    assert<IsStringOfGivenLength<'1', 1>, true>; // Valid
    assert<IsStringOfGivenLength<'12', 1>, false>; // Invalid: long
    assert<IsStringOfGivenLength<'123', 3>, true>; // Valid
    assert<IsStringOfGivenLength<'1234', 3>, false>; // Invalid: long
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('IsHexStringOfGivenLength: A utility type checking if type is a string of a specified length with only hex digits as characters', () => {
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

describe('IsGUID: A utility type chekcing if type is a GUID', () => {
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

describe('GUID: GUID string type', () => {
  it('Compile time checks', () => {
    // Valid GUID
    assert<GUID<'12345678-1234-1234-1234-12345678abcd'>>()('12345678-1234-1234-1234-12345678abcd');
    assert<GUID<'12345678-1234-1234-1234-12345678abcd'>>()(guid('12345678-1234-1234-1234-12345678abcd'));
    // Invalid GUID
    refute<GUID<'!2345678-1234-1234-1234-12345678abcd'>>()('!2345678-1234-1234-1234-12345678abcd');
    refute<GUID<'!2345678-1234-1234-1234-12345678abcd'>>()(guid('!2345678-1234-1234-1234-12345678abcd'));
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('GUID generator function, converts a string into a GUID type string, if properly formatted', () => {
  it('Compile time checks', () => {
    // Valid GUID
    assert<GUID<'12345678-1234-1234-1234-12345678abcd'>>()('12345678-1234-1234-1234-12345678abcd');
    assert<GUID<'12345678-1234-1234-1234-12345678abcd'>>()(guid('12345678-1234-1234-1234-12345678abcd'));
    refute<never>()(guid('12345678-1234-1234-1234-12345678abcd'));
    // Invalid GUID
    refute<GUID<'!2345678-1234-1234-1234-12345678abcd'>>()('!2345678-1234-1234-1234-12345678abcd');
    refute<GUID<'!2345678-1234-1234-1234-12345678abcd'>>()(guid('!2345678-1234-1234-1234-12345678abcd'));
    assert<never>()(guid('!2345678-1234-1234-1234-12345678abcd'));
    // Empty runtime assert for jasmine
    assert(true);
  });
});
