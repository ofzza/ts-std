// JS class and class instance type definitions
// ----------------------------------------------------------------------------

/**
 * Internal type equaling a class constructor
 */
export type _ClassAbstractConstructor<T = any> = abstract new (...args: any[]) => T;
/**
 * Internal type equaling a class constructor
 */
export type _ClassConstructor<T = any> = new (...args: any[]) => T;

/**
 * A class constructor which constructs instances of type T
 * @template T (Optional) Type the class constructs
 */
export type Class<T extends InstanceType<_ClassAbstractConstructor<object>> = InstanceType<_ClassAbstractConstructor<object>>> = T extends _ClassConstructor<
  infer R
>
  ? new (...args: ConstructorParameters<T>) => R
  : new (...args: any[]) => T;

/**
 * An instance of type T of a class constructor which constructs instances of type T
 * @template (Optional) T Type of a constructed instance of a class
 */
export type ClassInstance<T extends object = object> = T extends _ClassConstructor<infer R> ? R : T;
