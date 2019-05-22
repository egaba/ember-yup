import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // this.route('validation-components', function() {
  //   this.route('validation-form', function() {
  //     this.route('async');
  //     this.route('sync');
  //     this.route('nested-data');
  //   });
  //
  //   this.route('field', {
  //     path: '/:fieldName'
  //   }, function() {
  //     this.route('validation-options', { path: '/' });
  //     this.route('actions');
  //     this.route('api-reference');
  //   });
  // });
  this.route('changelog');
  this.route('getting-started', function() {
    this.route('installation', { path: '/' });
    this.route('quick-start', function() {
      this.route('demo', { path: '/' });
      this.route('define-schema');
      this.route('setup-controller');
      this.route('build-template');
    });
    this.route('using-schemas');
    this.route('using-components');
  });

  this.route('blog', function() {
    this.route('beta-release');

    this.route('post', {
      path: '/:slug'
    });
  });

  this.route('form-components', function() {
    this.route('text-field');
    this.route('number-field');
    this.route('boolean-field');
    this.route('date-field');
    this.route('validation-form', function() {
      this.route('sync-validation');
      this.route('async-validation');
    });
  });
  this.route('yup-playground', function() {
    this.route('new');

    this.route('edit', {
      path: '/:id'
    });
  });

  // this.route('404', { path: '/*path' });

  this.route('not-found', {
    path: '/:*path'
  });
});

export default Router;
