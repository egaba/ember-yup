import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-checkbox',
  disabled: false,
  checked: '',
  attributeBindings: ['disabled', 'checked'],
});
