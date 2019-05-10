function readData(data, componentName) {
  const comments = data[componentName];

  const info = {
    properties: {},
    methods: {},
  };

  try {
    comments.forEach(function(comment) {
      const commentData = {
        params: [],
      };

      comment.tags.forEach(function(tag) {
        if (tag.title === 'class') {
          info.name = tag.name;
          info.description = comment.description;
        } else if (tag.title === 'property') {
          // console.log('prop', tag);
          let type = '';
          if (tag.type && tag.type.type === 'UnionType') {
            tag.type.elements.forEach(function({ name }) {
              if (!type) {
                type = name;
              } else {
                type = `${type}|${name}`;
              }
            });
            commentData.type = type;
          } else if (tag.type && tag.type.name) {
            commentData.type = tag.type.name;
          }
          if (tag.type && tag.type.name === 'Enum') {
            commentData.enums = tag.description.split('|');
          }
          commentData.description = comment.description;
          info.properties[tag.name] = commentData;
        } else if (tag.title === 'function') {
          commentData.type = 'method';
          commentData.description = comment.description;

          info.methods[tag.name] = commentData;
        } else if (tag.title === 'action') {
          commentData.type = 'action';
        } else if (tag.title === 'yielded') {
          commentData.isYielded = true;
        } else if (tag.title === 'private') {
          commentData.isPrivate = true;
        } else if (tag.title === 'validationOption') {
          commentData.isValidationOption = true;
        } else if (tag.title === 'defaultValue') {
          commentData.defaultValue = tag.description;
        } else if (tag.title === 'param') {
          console.log('adding param');
          commentData.params.push(tag);
        }

        else {
          console.log('unknown tag', tag, tag.title === 'param', commentData);
        }
      });
    });
  } catch(e) {
    console.error(e);
  }

  return Object.assign({}, info);
}

export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');
  const apiData = appInstance.lookup('api:components');

  const components = ['text-field', 'boolean-field', 'number-field', 'date-field', 'validation-form'];

  const baseFieldData = readData(apiData, 'form-field');

  components.forEach(function(componentName) {
    const componentData = readData(apiData, componentName);

    // console.log('create class', componentData.name, componentData);

    const baseClass = store.createRecord('api-class', {
      id: componentName,
      name: componentData.name,
      description: componentData.description
    });

    Ember.assign(componentData.properties, baseFieldData.properties);

    for (const propertyName in componentData.properties) {
      const data = componentData.properties[propertyName];

      // console.log('create prop', propertyName, data);

      store.createRecord('class-property', {
        id: `${componentName}-${propertyName}`,
        class: baseClass,
        name: propertyName,
        oneOfType: data.type,
        description: data.description,
        isPrivate: data.isPrivate,
        isYielded: data.isYielded
      });
    }

    Ember.assign(componentData.methods, baseFieldData.methods);

    for (const methodName in componentData.methods) {
      const data = componentData.methods[methodName];

      // console.log('create method', methodName, data);

      if (data.params.length) {
        console.log('adding params', data);
      }

      const method = store.createRecord('class-method', {
        id: `${componentName}-${methodName}`,
        class: baseClass,
        name: methodName,
        description: data.description,
        isPrivate: data.isPrivate,
        isYielded: data.isYielded,
      });

      data.params.forEach(function(param) {
        store.createRecord('method-param', {
          method: method,
          name: param.name,
          meta: param.type
        });
      });
    }
  });
}

export default {
  initialize
};
