import * as yup from 'yup';

function applyPropToSchema(collector, model) {
  return function(name, attributes) {
    const schemaProp = {};
    const attr = model.attributes.get(name);
    const dataType = attr.type || 'string';
    const schemaProps = attr.options && attr.options.validate || {};

    let propSchema = yup[dataType] && yup[dataType]() || yup.mixed();

    for (const propName in schemaProps) {
      const value = schemaProps[propName];
      const message = schemaProps[`${propName}Message`];

      if (propSchema[propName]) {
        const shouldIncludeValue = /min|max/.test(propName);
        if (shouldIncludeValue) {
          propSchema = propSchema[propName](value, message);
        } else {
          propSchema = propSchema[propName](message);
        }
      }
    }

    collector[name] = propSchema;
  }
}

export function initialize(appInstance) {
  const validationModelNames = ['user']; // TODO: via config
  const store = appInstance.lookup('service:store');

  validationModelNames.forEach(function(modelName) {
    const model = store.modelFor(modelName);
    const schemaAttrs = {};

    model.eachAttribute(applyPropToSchema(schemaAttrs, model));
    model.prototype._schema = yup.object().shape(schemaAttrs);
  });
}

export default {
  initialize
};
