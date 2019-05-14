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
  fieldMarkup: Ember.computed('field.stringCharLimit', 'field.stringMatches', 'isText', 'field.subType', 'showErrorMessages', 'field.componentName', 'field.displayErrorMessages', 'field.required', 'showErrorMessagesOnUpdate', function() {
    const componentName = this.get('field.componentName');
    const displayErrorMessages = this.get('field.displayErrorMessages');
    let controlMarkup, errorMessagesMarkup = '', toggleErrorMessagesOnBlur = '', subTypeMarkup = '';

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
      value=fieldValue${requiredMarkup}${errorMessagesMarkup}${subTypeMarkup}${charLimitMarkup}
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
      'value'
    );

    this.set('initialState', initialState);
  },

  reload: Ember.observer('field.required', 'field.displayErrorMessages', function() {
    this.set('isReloading', true);
    this.set('didBlur', false);
    Ember.run.later(() => {
      this.set('isReloading', false);
    }, 10);
  }),

  resetField: Ember.observer('field.componentName', 'field.enabled', function() {
    this.get('field').setProperties(this.get('initialState'));
    this.set('fieldValue', this.get('initialState.value'));
    this.set('didBlur', false);
    this.reload();
  }),

  isReloading: false,
  showSettings: true,

  currentTab: 'demo',
  classNames: ['code-demo', 'mb-8'],

  actions: {
    reset() {
      this.resetField();
    },
  }
});
