// Configure testing library
// ----------------------------------------------------------------------------

// Import dependencies
import { SpecReporter } from 'jasmine-spec-reporter';

// Configure reporter
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayErrorMessages: true,
      displaySuccessful: true,
      displayFailed: true,
      displayPending: true,
      displayDuration: true,
    },
  }),
);
