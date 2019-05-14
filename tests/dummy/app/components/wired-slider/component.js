import Component from '@ember/component';

export default Component.extend({
  tagName: 'wired-slider',
  min: 0,
  max: 100,
  value: 0,
  attributeBindings: ['min', 'max', 'value'],
});
