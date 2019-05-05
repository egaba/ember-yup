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
    // this.route('text-field');
    // this.route('number-field');
    // this.route('date-field');
    // this.route('boolean-field');

    this.route('field', {
      path: '/:fieldName'
    }, function() {
      this.route('overview', {
        path: '/'
      });
      this.route('validation-options');
      this.route('actions');
      this.route('api-reference');
    });
  });
  this.route('changelog');
  this.route('getting-started', function() {
    this.route('installation', { path: '/' });
    this.route('quick-start', function() {
      this.route('setup-properties');
      this.route('build-template');
      this.route('demo');
    });
  });
  this.route('blog', function() {
    this.route('beta-release');

    this.route('post', {
      path: '/:slug'
    });
  });
});

export default Router;
