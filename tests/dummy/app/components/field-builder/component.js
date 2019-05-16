import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  field: null,
  isBoolean: Ember.computed('field.componentName', function() {
    return /bool/.test(this.get('field.componentName'));
  }),
  isText: Ember.computed('field.componentName', function() {
    return /text/.test(this.get('field.componentName'));
  }),
  isStringMatches: Ember.computed('isText', 'field.subType', function() {
    return this.get('isText') && this.get('field.subType') === 'matches';
  }),
  stringMatches: Ember.computed('isStringMatches', 'field.stringMatches', function() {
    let regex = '';
    if (this.get('isStringMatches')) {
      regex = this.get('field.stringMatches');
    }
    return regex;
  }),
  isNumber: Ember.computed('field.componentName', function() {
    return /number/.test(this.get('field.componentName'));
  }),
  isDate: Ember.computed('field.componentName', function() {
    return /date/.test(this.get('field.componentName'));
  }),
  showErrorMessages: Ember.computed('field.displayErrorMessages', 'didBlur', function() {
    const blur = this.get('field.displayErrorMessages') === 'onBlur' && this.get('didBlur');
    return this.get('field.displayErrorMessages') === 'onInit' || blur;
  }),
  didBlur: false,
  showErrorMessagesOnUpdate: Ember.computed('field.displayErrorMessages', function() {
    return this.get('field.displayErrorMessages') === 'onBlur' ? false : true;
  }),
  validationMessagesMarkup: Ember.computed('field.requiredValidationMessage',
  'field.matchesValidationMessage', 'field.matchesValidationMessage', 'field.charLimitValidationMessage',
  'field.emailValidationMessage', 'field.urlValidationMessage', 'field.required', 'isText', 'isStringMatches',
  'isDate', 'field.minDate', 'field.maxDate', 'field.minDateMessage', 'field.maxDateMessage',
  'isNumber', 'field.isInteger', 'field.isNegative', 'field.isPositive', 'field.minRangeNumber',
  'field.maxRangeNumber', 'field.greaterThanNumber', 'field.lessThanNumber', 'field.integerMessage',
  'field.negativeMessage', 'field.positiveMessage', 'field.greaterThanMessage', 'field.lessThanMessage',
  'field.minNumberMessage', 'field.maxNumberMessage', 'field.dataTypeMessage',
  function() {

    const messages = [];

    if (this.get('field.required') && this.get('field.requiredValidationMessage')) {
      messages.push(`required="${this.get('field.requiredValidationMessage')}"`);
    }

    if (this.get('isText')) {
      if (this.get('field.subType') === 'email' && this.get('field.emailValidationMessage')) {
        messages.push(`email="${this.get('field.emailValidationMessage')}"`);
      } else if (this.get('field.subType') === 'url' && this.get('field.urlValidationMessage')) {
        messages.push(`url="${this.get('field.urlValidationMessage')}"`);
      } else if (this.get('isStringMatches') && this.get('field.matchesValidationMessage')) {
        messages.push(`matches="${this.get('field.matchesValidationMessage')}"`);
      }
    } else if (this.get('isDate')) {
      if (this.get('field.minDate') && this.get('field.minDateMessage')) {
        messages.push(`min="${this.get('field.minDateMessage')}"`);
      }
      if (this.get('field.maxDate') && this.get('field.maxDateMessage')) {
        messages.push(`max="${this.get('field.maxDateMessage')}"`);
      }
    } else if (this.get('isNumber')) {
      if (this.get('field.isInteger') && this.get('field.integerMessage')) {
        messages.push(`integer="${this.get('field.integerMessage')}"`);
      }
      if (this.get('field.isPositive') && this.get('field.positiveMessage')) {
        messages.push(`positive="${this.get('field.positiveMessage')}"`);
      }
      if (this.get('field.isNegative') && this.get('field.negativeMessage')) {
        messages.push(`negative="${this.get('field.negativeMessage')}"`);
      }
      if (Ember.isPresent(this.get('field.minRangeNumber')) && this.get('field.minNumberMessage')) {
        messages.push(`min="${this.get('field.minNumberMessage')}"`);
      }
      if (Ember.isPresent(this.get('field.maxRangeNumber')) && this.get('field.maxNumberMessage')) {
        messages.push(`max="${this.get('field.maxNumberMessage')}"`);
      }
      if (Ember.isPresent(this.get('field.lessThanNumber')) && this.get('field.lessThanMessage')) {
        messages.push(`lt="${this.get('field.lessThanMessage')}"`);
      }
      if (Ember.isPresent(this.get('field.greaterThanNumber')) && this.get('field.greaterThanMessage')) {
        messages.push(`gt="${this.get('field.greaterThanMessage')}"`);
      }
    }

    if (this.get('field.dataTypeMessage')) {
      messages.push(`dataType="${this.get('field.dataTypeMessage')}"`);
    }

    let validationMessagesMarkup = '';

    if (messages.length) {
      validationMessagesMarkup = `
      validationMessages=(hash`;

      messages.forEach(function(msg) {
        validationMessagesMarkup += `
        ${msg}`;
      });

      validationMessagesMarkup += `
      )`;
    }

    return validationMessagesMarkup;
  }),
  fieldMarkup: Ember.computed(
      'field.required', 'field.stringCharLimit', 'field.stringMatches', 'isText',
      'field.subType', 'showErrorMessages', 'field.componentName', 'field.displayErrorMessages',
      'field.required', 'showErrorMessagesOnUpdate', 'validationMessagesMarkup',
      'field.integerNumber', 'field.minRangeNumber', 'field.maxRangeNumber', 'field.greaterThanNumber',
      'field.lessThanNumber', 'field.isPositive', 'field.isNegative', 'field.isInteger',
      'field.minDate', 'field.maxDate', 'isNumber', 'isDate',
  function() {
    const componentName = this.get('field.componentName');
    const displayErrorMessages = this.get('field.displayErrorMessages');
    let controlMarkup, errorMessagesMarkup = '', toggleErrorMessagesOnBlur = '', subTypeMarkup = '', validationMessagesMarkup = this.get('validationMessagesMarkup');
    let nonZeroMarkup = '', integerMarkup = '', minNumberMarkup = '', maxNumberMarkup = '', gtMarkup = '', ltMarkup = '';

    if (this.get('isNumber')) {
      if (this.get('field.isPositive')) {
        nonZeroMarkup = `
        positive=true`;
      } else if (this.get('field.isNegative')) {
        nonZeroMarkup = `
        negative=true`;
      }

      if (this.get('field.isInteger')) {
        integerMarkup = `
        integer=true`;
      }

      const minNumber = this.get('field.minRangeNumber');
      if (Ember.isPresent(minNumber)) {
        minNumberMarkup = `
        min=${minNumber}`;
      }

      const maxNumber = this.get('field.maxRangeNumber');
      if (Ember.isPresent(maxNumber)) {
        maxNumberMarkup = `
        max=${maxNumber}`;
      }

      const gtNumber = this.get('field.greaterThanNumber');
      if (Ember.isPresent(gtNumber)) {
        gtMarkup = `
        gt=${gtNumber}`;
      }

      const ltNumber = this.get('field.lessThanNumber');
      if (Ember.isPresent(ltNumber)) {
        ltMarkup = `
        lt=${ltNumber}`;
      }
    }

    let minDateMarkup = '', maxDateMarkup = '';
    if (this.get('isDate')) {
      const minDate = this.get('field.minDate');
      if (minDate) {
        minDateMarkup = `
      min="${minDate}"`;
      }

      const maxDate = this.get('field.maxDate');
      if (maxDate) {
        maxDateMarkup = `
      max="${maxDate}"`;
      }
    }

    if (displayErrorMessages === 'onInit') {
      errorMessagesMarkup = `
      showErrorMessages=${this.get('showErrorMessages')}`;
    } else if (displayErrorMessages === 'onBlur') {
      errorMessagesMarkup = `
      showErrorMessagesOnUpdate=${this.get('showErrorMessagesOnUpdate')}`;
      toggleErrorMessagesOnBlur = `
        onblur={{action (mut field.showErrorMessages) true}}`;
    }

    if (/bool/.test(componentName)) {
      controlMarkup = `<input
        type="checkbox"
        checked={{fieldValue}}
        onclick={{action (mut fieldValue) value="target.checked"}}
      >`;
    } else {
      controlMarkup = `<input
        type="text"
        value={{fieldValue}}
        oninput={{action (mut fieldValue) value="target.value"}}${toggleErrorMessagesOnBlur}
      >`;
    }

    const subType = this.get('field.subType');
    const isText = this.get('isText');
    let charLimitMarkup = '';

    if (isText) {
      if (this.get('isStringMatches')) {
        subTypeMarkup = `
      matches="${this.get('field.stringMatches') || ''}"`;
      } else {
        if (subType === 'email') {
          subTypeMarkup = `
      type="email"`;
        } else if (subType === 'url') {
          subTypeMarkup = `
      type="url"`;
        }
      }

      if (this.get('field.stringCharLimit')) {
        charLimitMarkup = `
      charLimit="${this.get('field.stringCharLimit')}"`
      }
    }

    const requiredMarkup = this.get('field.required') ? `
      required=true` : '';

    return `
    {{#${componentName}
      value=fieldValue${requiredMarkup}${errorMessagesMarkup}${subTypeMarkup}${charLimitMarkup}${validationMessagesMarkup}${nonZeroMarkup}${integerMarkup}${minNumberMarkup}${maxNumberMarkup}${ltMarkup}${gtMarkup}${minDateMarkup}${maxDateMarkup}
      as |field|
    }}
      ${controlMarkup}
      {{#each field.errorMessages as |errorMessage|}}
        <p>{{errorMessage}}</p>
      {{/each}}
    {{/${componentName}}}
    `
  }),
  fieldValue: undefined,
  fieldValueType: Ember.computed('fieldValue', function() {
    return typeof(this.get('fieldValue'));
  }),

  init() {
    this._super(...arguments);

    const initialState = this.get('field').getProperties(
      'required',
      'showErrorMessages',
      'requiredValidationMessage',
      'value',
      'stringMatches'
    );

    this.set('initialState', initialState);
  },

  ensurePositive: Ember.observer('field.isPositive', function() {
    if (this.get('field.isPositive')) {
      this.set('field.isNegative', false);
    }
  }),

  ensureNegative: Ember.observer('field.isNegative', function() {
    if (this.get('field.isNegative')) {
      this.set('field.isPositive', false);
    }
  }),

  resetField: Ember.observer('field.disabled', function() {
    this.get('field').setProperties(this.get('initialState'));
    this.set('fieldValue', this.get('initialState.value'));
    this.set('didBlur', false);
  }),

  refreshCode: Ember.observer(
    'field.required', 'field.displayErrorMessages', 'field.subType',
    'field.isNegative', 'field.isPositive', 'field.isInteger', 'field.minRangeNumber',
    'field.maxRangeNumber', 'field.greaterThanNumber', 'field.lessThanNumber', 'fieldMarkup',
  function() {
    const cardId = `${this.get('elementId')}-code-card`;
    Ember.run.next(function() {
      document.getElementById(cardId).requestUpdate();
    });
  }),

  refreshSettings: Ember.observer('field.componentName', function() {
    const cardId = `${this.get('elementId')}-settings-card`;
    Ember.run.next(function() {
      document.getElementById(cardId).requestUpdate();
    });
  }),

  isReloading: false,
  showSettings: false,

  showCode: true,
  currentTab: Ember.computed('showCode', function() {
    return this.get('showCode') ? 'code' : 'demo';
  }),
  classNames: ['code-demo', 'mb-8'],

  actions: {
    reset() {
      this.resetField();
    },

    setCharLimit(e) {
      this.set('field.stringCharLimit', Math.round(e.target.value, 10));
    }
  }
});
