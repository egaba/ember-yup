import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['code-demo', 'mt-16'],
  activeTab: 'demo',
  demoLabel: 'demo',
  label1: 'example 1',
  label2: 'example 2',
  label3: 'example 3',
  example1: null,
  example2: null,
  example3: null,

  cardId: Ember.computed('key', 'elementId', function() {
    const key = this.get('key');
    const elementId = this.get('elementId');
    return key ? key : `${elementId}-card`;
  }),

  refreshCard: Ember.observer('activeTab', function() {
    const cardId = this.get('cardId');
    Ember.run.next(function() {
      const el = document.getElementById(cardId);
      if (el) {
        el.requestUpdate();
      }
    });
  })
});
