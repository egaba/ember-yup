import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-listbox',
  horizontal: false,
  selected: null,
  attributeBindings: ['horizontal', 'selected'],
});
