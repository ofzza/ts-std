// JS class and class instance type definitions tests
// ----------------------------------------------------------------------------

// Import dependencies
import * as root from '../../../';
import { assert, refute } from '../../../utility/assertion';
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
 * Testing base interface
 */
interface IClass {
  baseClassProperty: boolean;
}
/**
 * Checks if IClass interface is implemented by a type
 */
type IsImplementedInterfaceClass<T extends new (...args: any[]) => any> = ClassInstance<Class<T>> extends IClass ? true : false;

/**
 * Testing base class
 */
class BaseClass implements IClass {
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
 * Testing class with constructor argumensts
 */
class ClassWithConstructorArguments {
  constructor(a: string, b: number, c: boolean) {}
}

/**
 * Test Class instance
 */
const test = new BaseClass();

describe('Class<T>: A class which constructs instances of type T', () => {
  it('Compile time checks', () => {
    // Valid base class assignment
    assert<Class>()(BaseClass); // Base class can be assigned to type of Class
    assert<Class<BaseClass>>()(BaseClass); // Base class can be assigned to type of Class<T> (required when used with generics)
    assert<Class<typeof BaseClass>>()(BaseClass); // Base class can be assigned to type of Class<typeof T> (correct usage got non-generic T)
    // Valid extending class assignment
    assert<Class>()(ExtendingClass); // Extending class can be assigned to type of Class
    assert<Class<BaseClass>>()(ExtendingClass); // Extending class can be assigned to type of Class<T> (required when used with generics)
    assert<Class<typeof BaseClass>>()(ExtendingClass); // Extending class can be assigned to type of Class<typeof T> (correct usage got non-generic T)
    // Valid constructor arguments inference
    assert<ConstructorParameters<Class<ClassWithConstructorArguments>>, []>; // Constructor arguments can be queried, but won't be exact for Class<T> (required when used with generics)
    assert<ConstructorParameters<Class<typeof ClassWithConstructorArguments>>, [string, number, boolean]>; // Constructor arguments preserved for Class<typeof T> (correct usage got non-generic T)
    // Valid interface implementation detection
    assert<IsImplementedInterfaceClass<Class>, false>; // Interface detected as not implemented for Class
    assert<IsImplementedInterfaceClass<Class<BaseClass>>, true>; // Interface detected as implemented for base class assigned to Class<T>
    assert<IsImplementedInterfaceClass<Class<typeof BaseClass>>, true>; // Interface detected as implemented for base class assigned to Class<typeof T>
    assert<IsImplementedInterfaceClass<Class<ExtendingClass>>, true>; // Interface detected as implemented for extending class assigned to Class<T>
    assert<IsImplementedInterfaceClass<Class<typeof ExtendingClass>>, true>; // Interface detected as implemented for extending class assigned to Class<typeof T>
    assert<IsImplementedInterfaceClass<Class<AlternativeClass>>, false>; // Interface detected as not implemented for unrelated class assigned to Class<T>
    assert<IsImplementedInterfaceClass<Class<typeof AlternativeClass>>, false>; // Interface detected as not implemented for unrelated class assigned to Class<typeof T>

    // Invalid assignments
    refute<Class<BaseClass>>()(AlternativeClass); // Unrelated class can't be assigned to type of Class<T>
    refute<Class<typeof BaseClass>>()(AlternativeClass); // Unrelated class can't be assigned to type of Class<typeof T>
    refute<Class>()(() => {}); // A function can't be assigned to type of Class
    refute<Class<BaseClass>>()(() => {}); // A function can't be assigned to type of Class<T>
    refute<Class<typeof BaseClass>>()(() => {}); // A function can't be assigned to type of Class<typeof T>
    refute<Class<BaseClass>>()(() => new BaseClass()); // A factory function can't be assigned to type of Class<T>
    refute<Class<typeof BaseClass>>()(() => new BaseClass()); // A factory function can't be assigned to type of Class<typeof T>
    // Invalid constructor arguments inference
    refute<ConstructorParameters<Class<typeof ClassWithConstructorArguments>>>()([]); // Wrong constructor argements can't be assigned to Class<typeof T>
    refute<ConstructorParameters<Class<typeof ClassWithConstructorArguments>>>()(['a', 'a', 'a']); // Wrong constructor argements can't be assigned to Class<typeof T>
    refute<ConstructorParameters<Class<typeof ClassWithConstructorArguments>>>()([1, 1, 1]); // Wrong constructor argements can't be assigned to Class<typeof T>
    refute<ConstructorParameters<Class<typeof ClassWithConstructorArguments>>>()([true, true, true]); // Wrong constructor argements can't be assigned to Class<typeof T>

    // Empty runtime assert for jasmine
    assert();
  });
});

describe('ClassInstance<T>: An instance of type T of a class which constructs instances of type T', () => {
  it('Compile time checks', () => {
    // Valid
    assert<ClassInstance>()(new BaseClass()); // Class instance
    assert<ClassInstance<BaseClass>>()(new BaseClass()); // Class instance
    assert<ClassInstance<Class<BaseClass>>>()(new BaseClass()); // Class instance
    assert<ClassInstance<Class<typeof BaseClass>>>()(new BaseClass()); // Class instance
    assert<ClassInstance>()(new ExtendingClass()); // Extending class instance
    assert<ClassInstance<BaseClass>>()(new ExtendingClass()); // Extending class instance
    assert<ClassInstance<Class<BaseClass>>>()(new ExtendingClass()); // Extending class instance
    assert<ClassInstance<Class<typeof BaseClass>>>()(new ExtendingClass()); // Extending class instance
    // Invalid
    refute<ClassInstance>()(123); // Non object: Literal
    refute<ClassInstance>()(null); // Non object: NULL
    refute<ClassInstance>()(undefined); // Non object: Undefined
    refute<ClassInstance<BaseClass>>()(new AlternativeClass()); // Some other class instance
    refute<ClassInstance<Class<BaseClass>>>()(new AlternativeClass()); // Some other class instance
    refute<ClassInstance<Class<typeof BaseClass>>>()(new AlternativeClass()); // Some other class instance
    refute<ClassInstance<BaseClass>>()({}); // Object matching properties of the class instance
    refute<ClassInstance<Class<BaseClass>>>()({}); // Object matching properties of the class instance
    refute<ClassInstance<Class<typeof BaseClass>>>()({}); // Object matching properties of the class instance
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
