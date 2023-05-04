// JS class and class instance type definitions
// ----------------------------------------------------------------------------

/**
 * A class which constructs instances of type T
 */
export type Class<T> = new (...args: Array<any>) => T;

/**
 * An instance of type T of a class which constructs instances of type T
 */
export type ClassInstance<T = object> = object extends T ? T : InstanceType<Class<T>>;
