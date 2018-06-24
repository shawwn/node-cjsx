'use strict';

var fs          = require('fs');
var registered = false;

function transform({module, filename, src}) {
  var dax = require('dax').create();
  var code = dax.compile(dax.expand(['do', ...dax.reader['read-all'](dax.reader.stream(src))]));
  if (module) {
    module._compile(code, filename);
  }
  return code;
}

function register() {
  if (registered) {
    return;
  }

  require.extensions['.dax'] = function(module, filename) {
    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    try {
      src = transform({module, filename, src});
    } catch (e) {
      throw new Error('Error registering ' + filename + ' from dax: ' + e.toString());
    }
  };

  registered = true;
}

module.exports = {
  transform,
  register,
};
