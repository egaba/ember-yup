'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-outlet-outside-routes': false
  },
  overrides: [
    {
      excludedFiles: [
        'tests/dummy/app/**'
      ],
    }
  ]
};
