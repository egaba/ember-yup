import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  componentName: DS.attr({ defaultValue: 'text-field' }),
  value: DS.attr(),
  required: DS.attr('boolean', { defaultValue: true }),
  disabled: DS.attr('boolean', { defaultValue: false }),
  displayErrorMessages: DS.attr({ defaultValue: 'onInit' }),
  subType: DS.attr({ defaultValue: 'none' }),
  stringMatches: DS.attr(),
  stringCharLimit: DS.attr('number', { defaultValue: 0 }),
  requiredValidationMessage: DS.attr(),
  matchesValidationMessage: DS.attr(),
  charLimitValidationMessage: DS.attr(),
  emailValidationMessage: DS.attr(),
  urlValidationMessage: DS.attr(),
});
