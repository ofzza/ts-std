// JS class and class instance type definitions tests
// ----------------------------------------------------------------------------

// Import dependencies
import * as root from '../../../';
import { assert, refute } from '../../utility/assertion';
import { Class, ClassInstance } from './';

describe('JS class and class instance type definitions are exported from the library root', () => {
  it('Class type', () => {
    // Exported
    assert<root.Class<any>>;
    // Empty runtime assert for jasmine
    assert();
  });
  it('ClassInstance type', () => {
    // Exported
    assert<root.ClassInstance<any>>;
    assert<root.ClassInstance>;
    // Empty runtime assert for jasmine
    assert();
  });
});

/**
 * Testing base class
 */
class BaseClass {
  public baseClassProperty: boolean = true;
}
/**
 * Testing extending class
 */
class ExtendingClass extends BaseClass {
  public extendingClassProperty: boolean = true;
}
/**
 * Testing alternative class
 */
class AlternativeClass {
  public alternativeClassProperty: boolean = true;
}

/**
 * Test Class instance
 */
const test = new BaseClass();

describe('Class<T>: A class which constructs instances of type T', () => {
  it('Compile time checks', () => {
    // Valid
    assert<Class<BaseClass>>()(BaseClass); // Class
    assert<Class<BaseClass>>()(ExtendingClass); // Extending class
    // Invalid
    refute<Class<BaseClass>>()(AlternativeClass); // Some other class
    refute<Class<BaseClass>>()(() => {}); // Function
    refute<Class<BaseClass>>()(() => new BaseClass()); // Factory returning class instances
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('ClassInstance<T>: An instance of type T of a class which constructs instances of type T', () => {
  it('Compile time checks', () => {
    // Valid
    assert<ClassInstance<BaseClass>>()(new BaseClass()); // Class instance
    assert<ClassInstance<BaseClass>>()(new ExtendingClass()); // Extending class instance
    // Invalid
    refute<ClassInstance<BaseClass>>()(new AlternativeClass()); // Some other class instance
    refute<ClassInstance<BaseClass>>()({}); // Object matching properties of the class instance
    refute<ClassInstance>()(123); // Non object: Literal
    refute<ClassInstance>()(null); // Non object: NULL
    refute<ClassInstance>()(undefined); // Non object: Undefined
    // Empty runtime assert for jasmine
    assert();
  });
});

describe('ClassInstance: Any class instance', () => {
  it('Compile time checks', () => {
    // Valid
    assert<ClassInstance>()(new BaseClass()); // Class instance
    assert<ClassInstance>()(new ExtendingClass()); // Extending class instance
    assert<ClassInstance>()(new AlternativeClass()); // Some other class instance
    assert<ClassInstance>()({}); // Object instance
    // Invalid
    refute<ClassInstance>()(123); // Non object: Literal
    refute<ClassInstance>()(null); // Non object: NULL
    refute<ClassInstance>()(undefined); // Non object: Undefined
    // Empty runtime assert for jasmine
    assert();
  });
});
