import Component from '@ember/component';
import layout from './template';

let toggleFixedNav;

export default Component.extend({
  layout,

  isFixed: false,

  toggleFixedNav() {
    if (this.get('_state') !== 'destroying') {
      const nav = document.getElementById(this.elementId);
      const navDistanceFromTop = nav.getBoundingClientRect().top;

      if (navDistanceFromTop < 0) {
        this.set('isFixed', true);
      } else {
        this.set('isFixed', false);
      }
    }
  },

  didRender() {
    toggleFixedNav = Ember.run.bind(this, function() {
      Ember.run.debounce(this, this.toggleFixedNav, 15);
    });

    window.addEventListener('scroll', toggleFixedNav);
  },
  willDestroyElement() {
    window.removeEventListener('scroll', toggleFixedNav);
  }
});
