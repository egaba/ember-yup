import DS from 'ember-data';
const { Model } = DS;

const typeMap = {
  AllLiteral: 'any'
};

export default Model.extend({
  method: DS.belongsTo('class-method'),
  name: DS.attr(),
  description: DS.attr(),
  meta: DS.attr(),
  type: Ember.computed('meta.type', 'meta.name', function() {
    return typeMap[this.get('meta.type')] || this.get('meta.name');
  })
});
