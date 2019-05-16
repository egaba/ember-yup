import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-textarea',
  disabled: false,
  placeholder: 'enter a message',
  type: 'text',
  value: '',
  rows: 4,
  maxrows: 8,
  attributeBindings: ['placeholder', 'disabled', 'type', 'value', 'blur:onblur', 'rows', 'maxrows'],
  didInsertElement() {
    this.element.pendingValue = this.get('value');

    Ember.run.next(this.element, function() {
      this.firstUpdated();
    });
  }
});
