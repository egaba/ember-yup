import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-card',
  elevation: 1,
  attributeBindings: ['elevation']
});
