import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-input',
  disabled: false,
  placeholder: '',
  type: 'text',
  value: '',
  attributeBindings: ['placeholder', 'disabled', 'type', 'value', 'blur:onblur'],
  didInsertElement() {
    this.element.pendingValue = this.get('value');

    Ember.run.next(this.element, function() {
      this.firstUpdated();
    });
  }
});
