import Component from '@ember/component';

export default Component.extend({
  tagName: 'wired-toggle',
  checked: false,
  disabled: false,
  attributeBindings: ['checked', 'disabled'],
});
