const fs = require('fs');
const doctrine = require('doctrine');

function parseJsDocs() {
  let data = {};

  try {
    const componentNames = fs.readdirSync('./addon/components');

    componentNames.forEach(function(componentName) {
      const contents = fs.readFileSync(`./addon/components/${componentName}/component.js`);
      const comments = contents.toString().match(/\/\*\*[\\\d\?\,\.\`'\'"\"_:!@#\$%\^&.\s\*\w@=\(\);{\|}\]\[\-\s]*\*\//ig);
      const parsedComments = [];

      if (comments) {
        comments.forEach(function(jsDocComment) {
          const parsedComment = doctrine.parse(jsDocComment, { unwrap: true });
          parsedComments.push(parsedComment);
        });

        data[componentName] = parsedComments;
      } else {
        data[componentName] = [];
      }
    });

  } catch(e) {
    console.error(e);
  }

  return JSON.stringify(data);
}

module.exports = parseJsDocs;
