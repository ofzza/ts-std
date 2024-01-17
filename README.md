# ts-std

TypeScript STD library, implementing some commonly used TypeScript types, utility types and related functionality.

## Core JS

Base types and utility types easing usage of native JS functionality

### `Class<typeof T>` and `ClassInstance<T>`

#### `Class<typeof T>`

`Class<typeof T>` type represents a class definition type - a value of this type can be constructed. The type's generic argument can be passed in a few different ways, producing subtly different behavior:

For the few following examples, let's assume there exist these classes:

```ts
class Person {
  constructor(public name: string) {}
}
class Employee extends Person {
  constructor(public override name: string, public role: string) {
    super(name);
  }
}
```

- No generic argument: `Class`

  When used with no Generic argument, Class type will be assignable to any class which can be constructed. It will also be agnostinc to which constructor arguments can or can't be passed to the class being constructed.

  ```ts
  // Constructs a class passed as the primary argument
  const create = (TargetClass: Class, ...args: any[]) => new TargetClass(...args);

  // This will construct a person, passing in the "Homer Simpson" argument.
  create(Person, 'Homer Simpson');
  // The `Class` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
  create({}, 'Homer Simpson'); // Throws a type error
  create((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
  // There is no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
  create(Person); // Missing constructor arguments aren't being checked
  create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
  create(Person, ['Homer', 'Simpson']); // Constructor arguments types aren't being checked
  ```

- Typeof Class as generic argument: `Class<typeof T>`

  When used with a `typeof Class` generic argument, Class type will only be assignable to the class specified by the generic argument or a class extending it. It will also perform full typechecking of constructor arguments, as if the generic type was being constructed directly:

  ```ts
  // Try using a constructor of a class cast as `Class<typeof T>`
  const PersonClass = Person as Class<typeof Person>;
  new PersonClass('Homer Simpson');
  new PersonClass(); // Missing constructor arguments throw a type error
  new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments throw a type error
  new PersonClass(['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error

  // Constructs a class passed as the primary argument
  const create = <TClass extends Class>(TargetClass: TClass, ...args: ConstructorParameters<TClass>) => new TargetClass(...args);

  // This will construct a person, passing in the "Homer Simpson" argument.
  create<typeof Person>(Person, 'Homer Simpson');
  // The `Class` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
  create<typeof Person>({}, 'Homer Simpson'); // Throws a type error
  create<typeof Person>((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
  // There is no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
  create<typeof Person>(Person); // Missing constructor arguments throw a type error
  create<typeof Person>(Person, 'Homer Simpson', 1, false); // Additional constructor arguments throw a type error
  create<typeof Person>(Person, ['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error
  ```

- Class as generic argument: `Class<T>`

  When passing a class (`Class<Person>`) as a generic argument instead of typeof class (`Class<typeof Class>`), the Class type will again be agnostinc to which constructor arguments can or can't be passed to the class being constructed. This is considered a unrecomended usage, but it is sometimes unavidable when the type argument has to be a generic argument itself:

  ```ts
  // Try using a constructor of a class cast as `Class<T>`
  const PersonClass = Person as Class<Person>;
  new PersonClass('Homer Simpson');
  new PersonClass(); // Missing constructor arguments aren't being checked
  new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
  new PersonClass(['Homer', 'Simpson']); // Constructor arguments types aren't being checked

  // Provides functionality for  ageneric class, including a construction of new instances
  class Service<T extends object> {
    // ˙TargetClass`˙has to be typed as `Class<T>`, because `Class<typeof T>` is not allowed by TypeScript since `T` itself is a generic argument
    public create(TargetClass: Class<T>, ...args: ConstructorParameters<Class<T>>) {
      return new TargetClass(...args);
    }
  }

  // This will construct a person, passing in the "Homer Simpson" argument.
  new Service<Person>().create(Person, 'Homer Simpson');
  // The `Class<T>` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
  new Service<Person>().create({}, 'Homer Simpson'); // Throws a type error
  new Service<Person>().create((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
  // The `Class<T>` type keeps you from passing any class other than ones extending the class specified by the generic `T` argument
  new Service<Employee>().create(Employee, 'Homer Simpson', 'Nuclear safety engineer'); // Accepts an extending class
  new Service<Employee>().create(Date, .'2000-01-01 00:00:00'); // Throws a type error
  // There is still no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
  new Service<Person>().create(Person); // Missing constructor arguments aren't being checked
  new Service<Person>().create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
  new Service<Person>().create(Person, ['Homer', 'Simpson']); // Constructor arguments types aren't being checked
  ```

  When ever possible this usage should be avoided and when possible the above example should instead be written like this:

  ```ts
  // Try using a constructor of a class cast as `Class<typeof T>`
  const PersonClass = Person as Class<typeof Person>;
  new PersonClass('Homer Simpson');
  new PersonClass(); // Missing constructor arguments throw a type error
  new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments throw a type error
  new PersonClass(['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error

  // Provides functionality for  ageneric class, including a construction of new instances
  class Service<TClass extends Class> {
    public create(TargetClass: TClass, ...args: ConstructorParameters<TClass>) {
      return new TargetClass(...args);
    }
  }

  // This will construct a person, passing in the "Homer Simpson" argument.
  new Service<typeof Person>().create(Person, 'Homer Simpson');
  // The `Class<typeof T>` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
  new Service<typeof Person>().create({}, 'Homer Simpson'); // Throws a type error
  new Service<typeof Person>().create((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
  // The `Class<typeof T>` type keeps you from passing any class other than ones extending the class specified by the generic `T` argument
  new Service<typeof Employee>().create(Employee, 'Homer Simpson', 'Nuclear safety engineer'); // Accepts an extending class
  new Service<typeof Employee>().create(Date, .'2000-01-01 00:00:00'); // Throws a type error
  // Unlike when we were using `ConstructorParameters<Class<T>>`, which failed to correctly infer constructor arguments, now that we're using `ConstructorParameters<TClass extends (typeof T)>`m the constructor arguments will be correctly inferred
  new Service<typeof Person>().create(Person); // Missing constructor arguments throw a type error
  new Service<typeof Person>().create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments throw a type error
  new Service<typeof Person>().create(Person, ['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error
  ```

#### `ClassInstance<T>`

// TODO: ,,,

## Common

Commonly (re)used types and related functionality.

### GUID

// TODO: ...

## Utility

### Assert/Refute

`assert<,>(...)` and `refute<>(...)` functions allow for runtime validation of expressions, within or outside of testing harnesses (such as Jasmine), but also for TS compile time validation of type matching.

#### `assert<TAssertion, TComparison>(expression?: boolean)(assertion: TAssertion)`

Function allows assertion of:

- Value or expression evaluating as truthy (at runtime)
- Two specified types being equal (at compile time)
- Value or expression type equals a specified type (at compile time)

---

- ##### Checking truthiness of a value or expression (`assert(expression: boolean)`):

  By passing an boolean argument to the function (or an expression evaluating to a boolean argument) the `assert(expression: boolean)` function will:

  - If Jasmine was detected to be present in the execution context: `expect(expression).toBeTrue()`
  - If Jasmine was not detected, to:
    - Throw if the `expression: boolean` argument evaluates to `false`
    - Execute successfully if `expression: boolean` argument evaluates to `true` This means the `assert(expression: boolean)` function can be used as a typical assert both within and outside of Jasmine context, as:

  ```ts
  // This will work
  assert(fnThatShouldWorkAndReturnTrue());
  assert(await asyncFnThatShouldWorkAndReturnTrue());
  assert(someResult === 'ExpectedValueOfTheResultVariable');
  // This will fail at run time
  assert(!fnThatShouldWorkAndReturnTrue());
  assert(!(await asyncFnThatShouldWorkAndReturnTrue()));
  assert(someResult === 'NotAllowedValueOfTheResultVariable');
  ```

- ##### Checking that a value matches a type (`assert<T>()(expression: T)`):

  If the first generic parameter is found to have been explicitly set, and function arguments we passed, the assert() function will return a type checking function typed to the first generic parameter. In this way, you can write compile-time checks verifying typing of values or methods' return types:

  ```ts
  // A custom, typed function used to lowercase property keys of type strings and not change if type number or symbol
  const lowercaseKey = <T extends string | number | symbol>(key: T): T => (typeof key === 'string' ? (key.toLowerCase() as T) : key);
  // This will work
  assert<string>()(lowercaseKey('myProperty'));
  assert<number>()(lowercaseKey(123));
  assert<symbol>()(lowercaseKey(Symbol('myProperty')));
  // This will fail at compile time
  assert<string>()(lowercaseKey(123));
  assert<string>()(lowercaseKey(Symbol('myProperty')));
  ```

- ##### Comparison of two types:

  By using both of the generic parameters, the assert() function can be used to check a custom type matching some other type. In this way, you can write compile-time checks verifying functionality of TS utility types:

  ```ts
  // This will work
  assert<'ABC', Uppercase<'abc'>>;
  assert<'ABC', Uppercase<string>>;
  assert<never, Uppercase<never>>;
  // This will fail at compile time
  assert<'abc', Uppercase<'abc'>>;
  assert<'abc', Uppercase<string>>;
  assert<null, Uppercase<string>>;
  ```

#### `refute<TRefutation>(expression?: boolean)(refutation: AnythingBut<TRefutation>)`

Function allows refutation of:

- Value or expression type equals a specified type (at compile time)
- A value or expression evaluating as truthy (at runtime)

---

- ##### Checking truthiness of a value or expression (`refute(expression: boolean)`):

  By passing an boolean argument to the function (or an expression evaluating to a boolean argument) the `refute(expression: boolean)` function can be used to:

  - If Jasmine was detected to be present in the execution context: `expect(expression).toBeFalse()`
  - If Jasmine was not detected, to:
    - Throw if the `expression: boolean` argument evaluates to `true`
    - Execute successfully if `expression: boolean` argument evaluates to `false` This means the `refute(expression: boolean)` function can be used as a reverse of a typical assert both within and outside of Jasmine context, as:

  ```ts
  // This will work
  refute(fnThatShouldWorkAndReturnFalse());
  refute(await asyncFnThatShouldWorkAndReturnFalse());
  refute(someResult === 'NotAllowedValueOfTheResultVariable');
  // This will fail at run time
  refute(!fnThatShouldWorkAndReturnFalse());
  refute(!(await asyncFnThatShouldWorkAndReturnFalse()));
  refute(someResult === 'ExpectedValueOfTheResultVariable');
  ```

- ##### Checking that a value mismatches a type (`refute<T>()(expression: T extends TRefutation ? never : T)`):

  If the first generic parameter is found to have been explicitly set, and function arguments we passed, the refute() function will return a type checking function typed to the first generic parameter. In this way, you can write compile-time checks refuting typing of values or methods' return types:

  ```ts
  // A custom, typed function used to lowercase property keys of type strings and not change if type number or symbol
  const lowercaseKey = <T extends string | number | symbol>(key: T): T => (typeof key === 'string' ? (key.toLowerCase() as T) : key);
  // This will work
  refute<string>()(lowercaseKey(123));
  refute<string>()(lowercaseKey(Symbol('myProperty')));
  // This will fail at compile time
  refute<string>()(lowercaseKey('myProperty'));
  refute<number>()(lowercaseKey(123));
  refute<symbol>()(lowercaseKey(Symbol('myProperty')));
  ```
