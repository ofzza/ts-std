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

#### `assert<TAssertion, TComparison>(expression?: boolean)(assertion: TAssertion)`

// TODO: ...

#### `refute<TRefutation>(expression?: boolean)(refutation: AnythingBut<TRefutation>)`

// TODO: ...
