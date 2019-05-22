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
  isLongText: Ember.computed('isText', 'field.stringMaxChars', 'field.stringMinChars', function() {
    const charLimit = parseInt(this.get('field.stringMaxChars'), 10) || 0;
    const charMin = parseInt(this.get('field.stringMinChars'), 10) || 0;
    return this.get('isText') && (charLimit > 10 || charMin > 10);
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
  didChangeValue: Ember.computed('initialState.value', 'fieldValue', function() {
    return this.get('initialState.value') !== this.get('fieldValue');
  }),

  clearValueOnTypeChange: Ember.observer('field.componentName', function() {
    this.set('value', undefined);
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
      @validationMessages={{hash`;

      messages.forEach(function(msg) {
        validationMessagesMarkup += `
        ${msg}`;
      });

      validationMessagesMarkup += `
      }}`;
    }

    return validationMessagesMarkup;
  }),
  fieldMarkup: Ember.computed(
      'field.required', 'field.stringCharLimit', 'field.stringMatches', 'isText',
      'field.subType', 'field.componentName', 'field.displayErrorMessages',
      'field.required', 'validationMessagesMarkup',
      'field.integerNumber', 'field.minRangeNumber', 'field.maxRangeNumber', 'field.greaterThanNumber',
      'field.lessThanNumber', 'field.isPositive', 'field.isNegative', 'field.isInteger',
      'field.minDate', 'field.maxDate', 'isNumber', 'isDate',
  function() {
    const componentName = this.get('field.componentName');
    const displayErrorMessages = this.get('field.displayErrorMessages');
    let controlMarkup, errorMessagesMarkup = '', toggleErrorMessagesOnBlur = '', subTypeMarkup = '', validationMessagesMarkup = this.get('validationMessagesMarkup');
    let nonZeroMarkup = '', integerMarkup = '', minNumberMarkup = '', maxNumberMarkup = '', gtMarkup = '', ltMarkup = '';
    const errorMessageStates = [];
    if (this.get('isNumber')) {
      if (this.get('field.isPositive')) {
        nonZeroMarkup = `
      @positive=true`;
      } else if (this.get('field.isNegative')) {
        nonZeroMarkup = `
      @negative=true`;
      }

      if (this.get('field.isInteger')) {
        integerMarkup = `
      @integer=true`;
      }

      const minNumber = this.get('field.minRangeNumber');
      if (Ember.isPresent(minNumber)) {
        minNumberMarkup = `
      @min=${minNumber}`;
      }

      const maxNumber = this.get('field.maxRangeNumber');
      if (Ember.isPresent(maxNumber)) {
        maxNumberMarkup = `
      @max=${maxNumber}`;
      }

      const gtNumber = this.get('field.greaterThanNumber');
      if (Ember.isPresent(gtNumber)) {
        gtMarkup = `
      @gt=${gtNumber}`;
      }

      const ltNumber = this.get('field.lessThanNumber');
      if (Ember.isPresent(ltNumber)) {
        ltMarkup = `
      @lt=${ltNumber}`;
      }
    }

    let minDateMarkup = '', maxDateMarkup = '';
    if (this.get('isDate')) {
      const minDate = this.get('field.minDate');
      if (minDate) {
        minDateMarkup = `
      @min="${minDate}"`;
      }

      const maxDate = this.get('field.maxDate');
      if (maxDate) {
        maxDateMarkup = `
      @max="${maxDate}"`;
      }
    }

    let errorMessages = `{{#each state.errorMessages as |msg|}}
        <p>{{msg}}</p>
      {{/each}}
    `
    if (displayErrorMessages === 'onBlur') {
      toggleErrorMessagesOnBlur = `
        onblur={{action actions.onBlur}}`;
      errorMessageStates.push('state.didBlur');
    } else if (displayErrorMessages === 'onUpdate') {
      errorMessageStates.push('state.didValueUpdate');
    }

    if (errorMessageStates.length === 1) {
      errorMessages = `{{#if ${errorMessageStates[0]}}}
        {{#each state.errorMessages as |msg|}}
          <p>{{msg}}</p>
        {{/each}}
      {{/if}}`
    } else if (errorMessageStates.length > 1) {
      errorMessages = `{{#if (and ${errorMessageStates.join(' ')})}}
        {{#each state.errorMessages as |msg|}}
          <p>{{msg}}</p>
        {{/each}}
      {{/if}}`
    } else {
      errorMessages = `{{#each state.errorMessages as |msg|}}
        <p>{{msg}}</p>
      {{/each}}`
    }

    if (/bool/.test(componentName)) {
      controlMarkup = `<input
        type="checkbox"
        checked={{fieldValue}}
        onclick={{action actions.onChange value="target.checked"}}
      >`;
    } else {
      controlMarkup = `<input
        type="text"
        value={{fieldValue}}
        oninput={{action actions.onChange value="target.value"}}${toggleErrorMessagesOnBlur}
      >`;
    }

    const subType = this.get('field.subType');
    const isText = this.get('isText');
    let charLimitMarkup = '', minStringMarkup = '', maxStringMarkup = '';

    if (isText) {
      if (this.get('isStringMatches')) {
        subTypeMarkup = `
      @matches="${this.get('field.stringMatches') || ''}"`;
      } else {
        if (subType === 'email') {
          subTypeMarkup = `
      @type="email"`;
        } else if (subType === 'url') {
          subTypeMarkup = `
      @type="url"`;
        }
      }

      // if (this.get('field.stringCharLimit')) {
      //   charLimitMarkup = `
      // charLimit=${this.get('field.stringCharLimit')}`
      // }

      if (this.get('field.stringMinChars')) {
        minStringMarkup = `
      @min=${this.get('field.stringMinChars')}`
      }

      if (this.get('field.stringMaxChars')) {
        maxStringMarkup = `
      @max=${this.get('field.stringMaxChars')}`
      }
    }

    const requiredMarkup = this.get('field.required') ? `
      @required=true` : '';

    const className = Ember.String.classify(componentName);
    // return `
    // {{#${componentName}
    //   value=fieldValue${requiredMarkup}${errorMessagesMarkup}${subTypeMarkup}${charLimitMarkup}${validationMessagesMarkup}${nonZeroMarkup}${integerMarkup}${minNumberMarkup}${maxNumberMarkup}${ltMarkup}${gtMarkup}${minDateMarkup}${maxDateMarkup}${minStringMarkup}${maxStringMarkup}
    //   as |state actions|
    // }}
    //   ${controlMarkup}
    //   ${errorMessages}
    // {{/${componentName}}}
    // `
    return `
    <${className}
      @value=fieldValue${requiredMarkup}${errorMessagesMarkup}${subTypeMarkup}${charLimitMarkup}${validationMessagesMarkup}${nonZeroMarkup}${integerMarkup}${minNumberMarkup}${maxNumberMarkup}${ltMarkup}${gtMarkup}${minDateMarkup}${maxDateMarkup}${minStringMarkup}${maxStringMarkup}
      as |state actions|
    >
      ${controlMarkup}
      ${errorMessages}
    </${className}>
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

  // resetField: Ember.observer('field.disabled', function() {
  //   // this.get('field').setProperties(this.get('initialState'));
  //   // this.set('fieldValue', this.get('initialState.value'));
  //   // this.set('didBlur', false);
  // }),
  //
  // clearField: Ember.observer('field.componentName', function() {
  //   // this.set('fieldValue', undefined);
  //   // this.set('didBlur', false);
  // }),

  refreshCode: Ember.observer(
    'field.required', 'field.displayErrorMessages', 'field.subType',
    'field.isNegative', 'field.isPositive', 'field.isInteger', 'field.minRangeNumber',
    'field.maxRangeNumber', 'field.greaterThanNumber', 'field.lessThanNumber', 'fieldMarkup',
    'field.debug', 'fieldValue',
  function() {
    const cardId = `${this.get('elementId')}-code-card`;
    Ember.run.next(function() {
      document.getElementById(cardId).requestUpdate();
    });
  }),

  refreshSettings: Ember.observer('field.componentName', function() {
    const cardId = `${this.get('elementId')}-settings-card`;
    Ember.run.next(function() {
      const element = document.getElementById(cardId);
      if (element) {
        element.requestUpdate();
      }
    });
  }),

  isReloading: false,
  showSettings: false,

  showCode: false,
  currentTab: Ember.computed('showCode', function() {
    return this.get('showCode') ? 'code' : 'demo';
  }),
  classNames: ['code-demo', 'mb-8', 'pt-1'],

  minValue: Ember.computed('field.componentName', 'field.stringMinChars', 'field.minRangeNumber', 'field.minDate',
  function() {
    const name = this.get('field.componentName');

    if (/text/.test(name)) {
      return this.get('field.stringMinChars');
    } else if (/number/.test(name)) {
      return this.get('field.minRangeNumber');
    } else if (/date/.test(name)) {
      return this.get('field.minDate');
    }

    return undefined;
  }),

  maxValue: Ember.computed('field.componentName', 'field.stringMaxChars', 'field.maxRangeNumber', 'field.maxDate',
  function() {
    const name = this.get('field.componentName');

    if (/text/.test(name)) {
      return this.get('field.stringMaxChars');
    } else if (/number/.test(name)) {
      return this.get('field.maxRangeNumber');
    } else if (/date/.test(name)) {
      return this.get('field.maxDate');
    }

    return undefined;
  }),

  minMessage: Ember.computed('field.componentName', 'field.minStringCharsMessage', 'field.minNumberMessage', 'field.minDateMessage',
  function() {
    const name = this.get('field.componentName');

    if (/text/.test(name)) {
      return this.get('field.minStringCharsMessage');
    } else if (/number/.test(name)) {
      return this.get('field.minNumberMessage');
    } else if (/date/.test(name)) {
      return this.get('field.minDateMessage');
    }

    return undefined;
  }),

  maxMessage: Ember.computed('field.componentName', 'field.maxStringCharsMessage', 'field.maxNumberMessage', 'field.maxDateMessage',
  function() {
    const name = this.get('field.componentName');

    if (/text/.test(name)) {
      return this.get('field.maxStringCharsMessage');
    } else if (/number/.test(name)) {
      return this.get('field.maxNumberMessage');
    } else if (/date/.test(name)) {
      return this.get('field.maxDateMessage');
    }

    return undefined;
  }),

  actions: {
    clear() {
      this.clearField();
    },
    reset() {
      this.resetField();
    },

    setCharMin(e) {
      this.set('field.stringMinChars', Math.round(e.target.value, 10));
    },

    setCharMax(e) {
      this.set('field.stringMaxChars', Math.round(e.target.value, 10));
    },
  }
});
