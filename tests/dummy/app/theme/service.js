import Service from '@ember/service';
import breakpoints from '../tailwind/config/screens';

export default Service.extend({
  viewportWidth: Ember.computed(function() {
    return window.innerWidth;
  }),
  currentBreakpoint: Ember.computed('viewportWidth', 'breakpointValues', function() {
    const breakpointValues = this.get('breakpointValues');
    const width = this.get('viewportWidth');

    if (width < breakpointValues.sm) {
      return 'xs';
    } else if (width >= breakpointValues.sm) {
      return 'sm';
    } else if (width >= breakpointValues.md) {
      return 'md';
    } else if (width >= breakpointValues.lg) {
      return 'lg';
    } else if (width >= breakpointValues.xl) {
      return 'xl';
    }
  }),

  // isWithinBreakpoint: Ember.computed('viewportWidth', 'down', 'up', function() {
  //   const width = this.get('viewportWidth');
  //   const theme = this.get('theme');
  //
  //   if (this.get('down')) {
  //     const breakpoint = parseInt(theme.get(`breakpoints.${this.get('down')}`).replace('px', ''), 10);
  //     return width < breakpoint;
  //   } else if (this.get('up')) {
  //     const breakpoint = parseInt(theme.get(`breakpoints.${this.get('up')}`).replace('px', ''), 10);
  //     return width >= breakpoint;
  //   }
  //
  //   return false;
  // }),
  breakpoints,
  breakpointValues: Ember.computed('breakpoints', function() {
    const breakpoints = this.get('breakpoints');

    const breakpointValues = {};

    for (const screen in breakpoints) {
      breakpointValues[screen] = parseInt(breakpoints[screen].replace('px', ''), 10);
    }

    return breakpointValues;
  })
});
