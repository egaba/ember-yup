import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-radio-group',
  selected: null,
  attributeBindings: ['selected'],
});
