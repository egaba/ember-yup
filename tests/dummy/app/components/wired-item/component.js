import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-item',
  value: null,
  attributeBindings: ['value', 'onclick'],
});
