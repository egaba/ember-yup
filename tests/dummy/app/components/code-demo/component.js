import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNames: ['code-demo', 'mb-8'],
  layout,
  markup: '',
  showCode: true,
  didInsertElement() {
    window.setTimeout(() => {
      const height = document.getElementById(this.elementId).clientHeight;
      this.element.style.height = `${height}px`;
    },300)
  }
});
