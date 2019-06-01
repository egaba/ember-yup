import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  down: null,
  up: null,
  between: null,
  only: null,
  theme: Ember.inject.service(),
  viewportWidth: Ember.computed.alias('theme.viewportWidth'),
  isWithinBreakpoint: Ember.computed('viewportWidth', 'down', 'up', function() {
    const width = this.get('viewportWidth');
    const theme = this.get('theme');

    if (this.get('down')) {
      const breakpoint = parseInt(theme.get(`breakpoints.${this.get('down')}`).replace('px', ''), 10);
      return width < breakpoint;
    } else if (this.get('up')) {
      const breakpoint = parseInt(theme.get(`breakpoints.${this.get('up')}`).replace('px', ''), 10);
      return width >= breakpoint;
    }

    return false;
  }),
  currentBreakpoint: Ember.computed.alias('theme.currentBreakpoint')
});
