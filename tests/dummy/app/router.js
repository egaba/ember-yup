import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('validation-components', function() {
    this.route('validation-form', function() {
      this.route('async');
      this.route('sync');
      this.route('nested-data');
    });
    this.route('text-field');
    this.route('number-field');
    this.route('date-field');
    this.route('boolean-field');
  });
  this.route('release-notes');
  this.route('getting-started', function() {
    this.route('installation', { path: '/' });
    this.route('quick-start', function() {
      this.route('setup-properties');
      this.route('build-template');
      this.route('demo');
    });
  });
});

export default Router;
