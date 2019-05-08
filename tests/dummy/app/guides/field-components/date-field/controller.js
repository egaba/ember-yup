import Controller from '@ember/controller';

export default Controller.extend({
  example: 'date',
  queryParams: ['example'],
  todaysDate: Ember.computed(function() {
    return new Date();
  }),
  dateDemo: `
    {{#date-field
      enabled=true
      value=date
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter a date"
        oninput={{action (mut date) value="target.value"}}
        value={{date}}
      >*ex. january 31, 1988
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/date-field}}
  `,
  requiredDemo: `
    {{#date-field
      showErrorMessages=true
      enabled=true
      value=requiredDate
      required=true
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter a date"
        oninput={{action (mut requiredDate) value="target.value"}}
        value={{requiredDate}}
      >*required
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/date-field}}
  `,
  futureDateDemo: `
    {{#date-field
      enabled=true
      value=minDate
      min=todaysDate
      required=true
      as |field|
    }}
      <input
        type="text"
        placeholder="Future date"
        oninput={{action (mut minDate) value="target.value"}}
        value={{minDate}}
      >*ex. april 6, 2050
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/date-field}}
  `,
  pastDateDemo: `
    {{#date-field
      enabled=true
      value=maxDate
      required=true
      max=todaysDate
      as |field|
    }}
      <input
        type="text"
        placeholder="Past date"
        oninput={{action (mut maxDate) value="target.value"}}
        value={{maxDate}}
      >*ex. december 12, 1984
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/date-field}}
  `,
  inclusiveDateDemo: `
    {{#date-field
      enabled=true
      value=inclusiveDate
      min="January 1, 2019"
      max="December 31, 2019"
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter a 2019 date"
        oninput={{action (mut inclusiveDate) value="target.value"}}
        value={{inclusiveDate}}
      >*ex. April 19, 2019
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/date-field}}
  `,
  properties: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isValidationOption && !prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  privateProps: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  validationOptions: Ember.computed('model', function() {
    const options = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isValidationOption) {
        options.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return options;
  }),

  functions: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),

  privateFuncs: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),
});
