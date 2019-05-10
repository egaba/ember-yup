import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  class: DS.belongsTo('api-class'),
  name: DS.attr(),
  description: DS.attr(),
  isPrivate: DS.attr('boolean', { defaultValue: false }),
  isYielded: DS.attr('boolean', { defaultValue: false }),
  params: DS.hasMany('method-param')
});
