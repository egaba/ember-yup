import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  properties: DS.hasMany('class-property'),
  methods: DS.hasMany('class-method')
});
