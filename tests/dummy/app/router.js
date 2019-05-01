import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('validate-schema', function() {
    this.route('controller', { path: '/' });
    this.route('template');
    this.route('model');
  });
  this.route('validation-components', function() {
    this.route('validation-form', function() {
      this.route('async');
      this.route('sync');
      this.route('nested-data');
    });
    this.route('text-field');
    this.route('number-field');
    this.route('date-field');
    this.route('array-field');
    this.route('object-field');
    this.route('boolean-field');
  });
  this.route('release-notes');
  this.route('getting-started');
});

export default Router;
