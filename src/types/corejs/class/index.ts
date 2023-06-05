// JS class and class instance type definitions
// ----------------------------------------------------------------------------

/**
 * Internal type equaling a class constructor
 */
type AbstractClassConstructor<T = any> = abstract new (...args: any[]) => T;
/**
 * Internal type equaling a class constructor
 */
type ClassConstructor<T = any> = new (...args: any[]) => T;

/**
 * A class constructor which constructs instances of type T
 * @template T (Optional) Type the class constructs
 */
export type Class<T extends InstanceType<AbstractClassConstructor<any>> = InstanceType<AbstractClassConstructor<object>>> = T extends ClassConstructor<infer R>
  ? new (...args: ConstructorParameters<T>) => R
  : new (...args: any[]) => T;

/**
 * An instance of type T of a class constructor which constructs instances of type T
 * @template (Optional) T Type of a constructed instance of a class
 */
export type ClassInstance<T extends object = object> = T extends ClassConstructor<infer R> ? R : T;
