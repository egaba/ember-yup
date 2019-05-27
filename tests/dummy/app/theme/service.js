import Service from '@ember/service';
import breakpoints from '../tailwind/config/screens';

export default Service.extend({
  viewportPosition: null,
  onScroll: Ember.observer('viewportPosition', function() {
    const viewportPosition = this.get('viewportPosition')
    console.log(viewportPosition);
  })
});
