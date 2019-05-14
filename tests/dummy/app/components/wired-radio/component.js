import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-radio',
  checked: false,
  disabled: false,
  text: '',
  name: '',
  attributeBindings: ['checked', 'disabled', 'text', 'name'],
});
