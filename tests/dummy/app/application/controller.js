import Controller from '@ember/controller';

export default Controller.extend({
  showNav: Ember.computed('currentPath', function() {
    const path = this.get('currentPath');
    return !/index|blog/.test(path)
  })
});
