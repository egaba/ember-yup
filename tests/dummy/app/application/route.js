import Route from '@ember/routing/route';

export default Route.extend({
  theme: Ember.inject.service(),
  activate() {
    const loading = document.getElementById('app-loading');
    loading.value = 60 + Math.round(Math.random() * 20);

    window.scrollTo(0,0);

    Ember.run.later(function() {
      const loadingContainer = document.getElementById('app-loading-container');
      loadingContainer.parentNode.removeChild(loadingContainer);
    }, 100);
  },

  sideMenu: Ember.inject.service(),

  actions: {
    willTransition() {
      if (this.get('sideMenu.isOpen')) {
        this.get('sideMenu').close();
      }
    },
  },
});
