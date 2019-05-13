import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  componentName: DS.attr({ defaultValue: 'text-field' }),
  value: DS.attr(),
  required: DS.attr('boolean', { defaultValue: true }),
  enabled: DS.attr('boolean', { defaultValue: true }),
  requiredValidationMessage: DS.attr(),
  displayErrorMessages: DS.attr({ defaultValue: 'onInit' })
});
