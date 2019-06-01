import fetch from 'fetch';
import config from 'dummy/config/environment';

export function initialize(application) {
  application.deferReadiness();

  const namespace = config.environment === 'development' ? '/' : '/ember-yup/';
  fetch(`${namespace}components-api.json`).then(function(response) {
    return response.json();
  }).then(function(data) {
    application.register('api:components', Ember.Object.extend(data));
    application.advanceReadiness();
  });
}

export default {
  initialize
};
