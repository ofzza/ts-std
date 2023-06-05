// Tests examples provided in README.md
// ----------------------------------------------------------------------------

// Import dependencies
import { assert, refute, Class, ClassInstance } from '.';

describe('README.md examples', () => {
  describe('Core JS', () => {
    describe('Class<typeof T>', () => {
      // Define fixtures
      class Person {
        constructor(public name: string) {}
      }
      class Employee extends Person {
        constructor(public override name: string, public role: string) {
          super(name);
        }
      }

      it('No generic argument: "Class"', () => {
        // Constructs a class passed as the primary argument
        const create = (TargetClass: Class, ...args: any[]) => new TargetClass(...args);

        // This will construct a person, passing in the "Homer Simpson" argument.
        create(Person, 'Homer Simpson');
        assert<Parameters<typeof create>>()([Person, 'HomerSimpson']);
        // The `Class` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
        // construct({}, .'Homer Simpson'); // Throws a type error
        // construct((name: string) => new Person(name), .'Homer Simpson'); // Throws a type error
        refute<Parameters<typeof create>>()([{}, 'HomerSimpson']);
        refute<Parameters<typeof create>>()([(name: string) => new Person(name), 'HomerSimpson']);
        // There is no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
        create(Person); // Missing constructor arguments aren't being checked
        assert<Parameters<typeof create>>()([Person]);
        create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
        assert<Parameters<typeof create>>()([Person, 'HomerSimpson', 1, false]);
        create(Person, ['Homer', 'Simpson']); // Constructor arguments types aren't being checked
        assert<Parameters<typeof create>>()([Person, ['Homer', 'Simpson']]);
      });

      it('Typeof Class as generic argument: `Class<typeof T>`', () => {
        // Try using a constructor of a class cast as `Class<typeof T>`
        const PersonClass = Person as Class<typeof Person>;
        new PersonClass('Homer Simpson');
        // new PersonClass(); // Missing constructor arguments throw a type error
        // new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments throw a type error
        // new PersonClass(['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error
        refute<ConstructorParameters<typeof PersonClass>>()([]);
        refute<ConstructorParameters<typeof PersonClass>>()(['Homer Simpson', 1, false]);
        refute<ConstructorParameters<typeof PersonClass>>()([['Homer', 'Simpson']]);

        // Constructs a class passed as the primary argument
        const create = <TClass extends Class>(TargetClass: TClass, ...args: ConstructorParameters<TClass>) => new TargetClass(...args);

        // This will construct a person, passing in the "Homer Simpson" argument.
        create<typeof Person>(Person, 'Homer Simpson');
        // The `Class` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
        // create<typeof Person>({}, 'Homer Simpson'); // Throws a type error
        // create<typeof Person>((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
        refute<Parameters<typeof create<typeof Person>>>()([{}, 'HomerSimpson']);
        refute<Parameters<typeof create<typeof Person>>>()([(name: string) => new Person(name), 'HomerSimpson']);
        // There is no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
        // create<typeof Person>(Person); // Missing constructor arguments throw a type error
        // create<typeof Person>(Person, 'Homer Simpson', 1, false); // Additional constructor arguments throw a type error
        // create<typeof Person>(Person, ['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error
        refute<Parameters<typeof create<typeof Person>>>()([Person]);
        refute<Parameters<typeof create<typeof Person>>>()([Person, 'Homer Simpson', 1, false]);
        refute<Parameters<typeof create<typeof Person>>>()([Person, ['Homer', 'Simpson']]);
      });

      it('Class as generic argument: `Class<T>`', () => {
        {
          // Try using a constructor of a class cast as `Class<T>`
          const PersonClass = Person as Class<Person>;
          new PersonClass('Homer Simpson');
          new PersonClass(); // Missing constructor arguments aren't being checked
          new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
          new PersonClass(['Homer', 'Simpson']); // Constructor arguments types aren't being checked

          // Provides functionality for  ageneric class, including a construction of new instances
          class Service<T extends object> {
            // ˙TargetClass`˙has to be typed as `T`, because `typeof T` is not allowed by TypeScript since `T` itself is a generic argument
            public create(TargetClass: Class<T>, ...args: any[]) {
              return new TargetClass(...args);
            }
          }

          // This will construct a person, passing in the "Homer Simpson" argument.
          new Service<Person>().create(Person, 'Homer Simpson');
          // The `Class<T>` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
          {
            // new Service<Person>().create({}, .'Homer Simpson'); // Throws a type error
            // new Service<Person>().create((name: string) => new Person(name), .'Homer Simpson'); // Throws a type error
            const create = new Service<Person>().create;
            refute<Parameters<typeof create>>()([{}, 'HomerSimpson']);
            refute<Parameters<typeof create>>()([(name: string) => new Person(name), 'HomerSimpson']);
          }
          // The `Class<T>` type keeps you from passing any class other than ones extending the class specified by the generic `T` argument
          {
            new Service<Employee>().create(Employee, 'Homer Simpson', 'Nuclear safety engineer'); // Accepts an extending class
            // new Service<Employee>().create(Date, '2000-01-01 00:00:00'); // Throws a type error
            const create = new Service<Employee>().create;
            refute<Parameters<typeof create>>()([Date, '2000-01-01 00:00:00']);
          }
          // There is still no type checking of the constructor arguments, so these will not throw type errors, and they might cause runtime issues down the line
          new Service<Person>().create(Person); // Missing constructor arguments aren't being checked
          new Service<Person>().create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
          new Service<Person>().create(Person, ['Homer', 'Simpson']); // Constructor arguments types aren't being checked
        }
        {
          // Try using a constructor of a class cast as `Class<T>`
          const PersonClass = Person as Class<typeof Person>;
          new PersonClass('Homer Simpson');
          // new PersonClass(); // Missing constructor arguments aren't being checked
          // new PersonClass('Homer Simpson', 1, false); // Additional constructor arguments aren't being checked
          // new PersonClass(['Homer', 'Simpson']); // Constructor arguments types aren't being checked
          refute<ConstructorParameters<typeof PersonClass>>()([]);
          refute<ConstructorParameters<typeof PersonClass>>()(['Homer Simpson', 1, false]);
          refute<ConstructorParameters<typeof PersonClass>>()([['Homer', 'Simpson']]);

          // Provides functionality for  ageneric class, including a construction of new instances
          class Service<TClass extends Class> {
            public create(TargetClass: TClass, ...args: ConstructorParameters<TClass>) {
              return new TargetClass(...args);
            }
          }

          // This will construct a person, passing in the "Homer Simpson" argument.
          new Service<typeof Person>().create(Person, 'Homer Simpson');
          // The `Class<typeof T>` type keeps you from passing anything other than a class to the function as its `TargetClass` argument
          {
            // new Service<typeof Person>().create({}, 'Homer Simpson'); // Throws a type error
            // new Service<typeof Person>().create((name: string) => new Person(name), 'Homer Simpson'); // Throws a type error
            const create = new Service<typeof Person>().create;
            refute<Parameters<typeof create>>()([{}, 'HomerSimpson']);
            refute<Parameters<typeof create>>()([(name: string) => new Person(name), 'HomerSimpson']);
          }
          // The `Class<typeof T>` type keeps you from passing any class other than ones extending the class specified by the generic `T` argument
          {
            new Service<typeof Employee>().create(Employee, 'Homer Simpson', 'Nuclear safety engineer'); // Accepts an extending class
            // new Service<typeof Employee>().create(Date, .'2000-01-01 00:00:00'); // Throws a type error
            const create = new Service<typeof Employee>().create;
            refute<Parameters<typeof create>>()([Date, '2000-01-01 00:00:00']);
          }
          // Unlike when we were using `ConstructorParameters<Class<T>>`, which failed to correctly infer constructor arguments, now that we're using `ConstructorParameters<TClass extends (typeof T)>`m the constructor arguments will be correctly inferred
          {
            // new Service<typeof Person>().create(Person); // Missing constructor arguments throw a type error
            // new Service<typeof Person>().create(Person, 'Homer Simpson', 1, false); // Additional constructor arguments throw a type error
            // new Service<typeof Person>().create(Person, ['Homer', 'Simpson']); // Constructor arguments type mismatch throws a type error
            const create = new Service<typeof Person>().create;
            refute<Parameters<typeof create>>()([Person]);
            refute<Parameters<typeof create>>()([Person, 'Homer Simpson', 1, false]);
            refute<Parameters<typeof create>>()([Person, ['Homer', 'Simpson']]);
          }
        }
      });
    });

    it('ClassInstance<T>', () => {
      // TODO: ...
      assert(true);
    });
  });

  describe('Common', () => {
    it('GUID', () => {
      // TODO: ...
      assert(true);
    });
  });

  describe('Utility', () => {
    describe('Assert/Refute', () => {
      it('assert<TAssertion, TComparison>(expression?: boolean)(assertion: TAssertion)', () => {
        // TODO: ...
        assert(true);
      });
      it('refute<TRefutation>(expression?: boolean)(refutation: AnythingBut<TRefutation>)', () => {
        // TODO: ...
        assert(true);
      });
    });
  });
});
