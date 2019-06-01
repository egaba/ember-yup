import fetch from 'fetch';

export function initialize(application) {
  application.deferReadiness();

  fetch('components-api.json').then(function(response) {
    return response.json();
  }).then(function(data) {
    application.register('api:components', Ember.Object.extend(data));
    application.advanceReadiness();
  });
}

export default {
  initialize
};
