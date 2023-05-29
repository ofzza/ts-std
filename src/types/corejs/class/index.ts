// JS class and class instance type definitions
// ----------------------------------------------------------------------------

/**
 * Internal type equaling a constructable object
 */
type InstanceOfObject = InstanceType<abstract new (...args: any) => object>;

/**
 * A class which constructs instances of type T
 * @template T Type the class constructs
 */
export type Class<T extends InstanceOfObject = InstanceOfObject> = T extends abstract new (...args: any) => infer R
  ? new (...args: ConstructorParameters<T>) => R
  : new (...args: any) => T;

/**
 * An instance of type T of a class which constructs instances of type T
 * @template (Optional) T Type of a constructed instance of a class
 */
export type ClassInstance<T extends object = object> = T extends Class<object> ? InstanceType<T> : T extends abstract new (...args: any) => object ? T : T;
