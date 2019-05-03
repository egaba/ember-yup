const fs = require('fs');
const doctrine = require('doctrine');

try {
  const parsedComments = [];
  const data = fs.readFileSync('./addon/components/form-field/component.js');
  const comments = data.toString().match(/\/\*\*[.\s\*\w@=\(\);{}\]\[\-]*\*\//g);

  comments.forEach(function(jsDocComment) {
    const parsedComment = doctrine.parse(jsDocComment, { unwrap: true });
    parsedComments.push(parsedComment);
  });

  parsedComments.forEach(function(comment) {
    console.log(comment);
    comment.tags.forEach(function(tag) {
      console.log(tag);
    });
  });
} catch(e) {
  console.error(e);
}
