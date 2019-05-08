import Route from '@ember/routing/route';

function readData(data, componentName) {
  const comments = data[componentName];

  const info = {
    properties: {},
    functions: {},
  };

  try {
    comments.forEach(function(comment) {
      const commentData = {};

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

          info.functions[tag.name] = commentData;
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
        } else {
          console.log('unknown tag', tag);
        }
      });
    });
  } catch(e) {
    console.error(e);
  }

  return Object.assign({}, info);
}

export default Route.extend({
  model() {
    return fetch('/components-api.json').then(function(response) {
      return response.json();
    }).then(function(data) {
      const formFieldInfo = readData(data, 'form-field');
      const fieldInfo = readData(data, 'date-field');

      Object.assign(fieldInfo.properties, formFieldInfo.properties);
      Object.assign(fieldInfo.functions, formFieldInfo.functions);

      return fieldInfo;
    });
  }
});
