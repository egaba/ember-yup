import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('validate-model', function() {
    this.route('controller', { path: '/' });
    this.route('template');
    this.route('model');
  });
});

export default Router;
