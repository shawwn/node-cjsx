var fs          = require('fs');
var transformed = false;

function transpile(src) {
  var dax = require('dax').create();
  return dax.compile(dax.expand(['do', ...dax.reader['read-all'](dax.reader.stream(src))]))
}

function transform() {
  if (transformed) {
    return;
  }

  require.extensions['.dax'] = function(module, filename) {
    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    try {
      src = transpile(src);
    } catch (e) {
      throw new Error('Error transforming ' + filename + ' from dax: ' + e.toString());
    }
    module._compile(src, filename);
  };

  transformed = true;
}

module.exports = {
  transform: transform
};
