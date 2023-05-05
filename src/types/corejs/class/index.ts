// JS class and class instance type definitions
// ----------------------------------------------------------------------------

/**
 * A class which constructs instances of type T
 * @template T Type the class constructs
 */
export type Class<T extends object> = new (...args: Array<any>) => T;

/**
 * An instance of type T of a class which constructs instances of type T
 * @template (Optional) T Type of a constructed instance of a class
 */
export type ClassInstance<T extends object = object> = object extends T ? T : InstanceType<Class<T>>;
