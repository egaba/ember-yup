const fs = require('fs');
const doctrine = require('doctrine');

function parseCommentsForPath(path) {
  const contents = fs.readFileSync(path);
  const comments = contents.toString().match(/\/\*\*[\\\d\?\,\.\`'\'"\"_:!@#\$%\^&.\s\*\w@=\(\);{\|}\]\[\-\s]*\*\//ig);
  const parsedComments = [];

  if (comments) {
    comments.forEach(function(jsDocComment) {
      const parsedComment = doctrine.parse(jsDocComment, { unwrap: true });
      parsedComments.push(parsedComment);
    });
  }

  return parsedComments || [];
}

function parseJsDocs() {
  let data = {};

  try {
    const componentNames = fs.readdirSync('./addon/components');

    componentNames.forEach(function(componentName) {
      data[componentName] = parseCommentsForPath(`./addon/components/${componentName}/component.js`);
    });

    data['validate-mixin'] = parseCommentsForPath(`./addon/mixins/validate-model.js`);
  } catch(e) {
    console.error(e);
  }

  return JSON.stringify(data);
}

module.exports = parseJsDocs;
