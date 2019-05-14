import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'wired-combo',
  attributeBindings: ['disabled', 'selected'],

  didInsertElement() {
    this.element.addEventListener('selected', (e) => {
      if (this.change) {
        this.change(e);
      }
    });
  }
});
