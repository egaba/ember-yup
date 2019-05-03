const fs = require('fs');
const doctrine = require('doctrine');

try {
  const data = {};
  const parsedComments = [];
  const componentNames = fs.readdirSync('./addon/components');

  componentNames.forEach(function(componentName) {
    const contents = fs.readFileSync(`./addon/components/${componentName}/component.js`);
    const comments = contents.toString().match(/\/\*\*[.\s\*\w@=\(\);{}\]\[\-]*\*\//g);

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

  console.log(data);
} catch(e) {
  console.error(e);
}
