import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  componentName: DS.attr({ defaultValue: 'text-field' }),
  value: DS.attr(),
  required: DS.attr('boolean', { defaultValue: true }),
  disabled: DS.attr('boolean', { defaultValue: false }),
  displayErrorMessages: DS.attr({ defaultValue: 'onInit' }),
  subType: DS.attr({ defaultValue: 'none' }),
  stringMatches: DS.attr({ defaultValue: '\\w+' }),
  stringCharLimit: DS.attr('number', { defaultValue: 0 }),
  requiredValidationMessage: DS.attr({ defaultValue: '' }),
  matchesValidationMessage: DS.attr({ defaultValue: '' }),
  charLimitValidationMessage: DS.attr({ defaultValue: '' }),
  emailValidationMessage: DS.attr({ defaultValue: '' }),
  urlValidationMessage: DS.attr({ defaultValue: '' }),


  isInteger: DS.attr('boolean'),
  isNegative: DS.attr('boolean'),
  isPositive: DS.attr('boolean'),
  minRangeNumber: DS.attr('number'),
  maxRangeNumber: DS.attr('number'),
  minDate: DS.attr('date'),
  maxDate: DS.attr('date'),
  greaterThanNumber: DS.attr('number'),
  lessThanNumber: DS.attr('number'),
  integerMessage: DS.attr({ defaultValue: '' }),
  negativeMessage: DS.attr({ defaultValue: '' }),
  positiveMessage: DS.attr({ defaultValue: '' }),
  greaterThanMessage: DS.attr({ defaultValue: '' }),
  lessThanMessage: DS.attr({ defaultValue: '' }),
  minNumberMessage: DS.attr({ defaultValue: '' }),
  maxNumberMessage: DS.attr({ defaultValue: '' }),
  minDateMessage: DS.attr({ defaultValue: '' }),
  maxDateMessage: DS.attr({ defaultValue: '' }),
  dataTypeMessage: DS.attr({ defaultValue: '' }),
});
