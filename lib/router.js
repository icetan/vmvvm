module.exports = function(routes) {
  var regexps = {}, i;

  for (i in routes) {
    regexps[i] = new RegExp('^'+i+'$');
  }

  return function(path) {
    var i, m;
    if (path in routes) {
      return routes[path]();
    }
    for (i in regexps) {
      m = path.match(regexps[i]);
      if (m != null) {
        return routes[i].apply(undefined, m.slice(1));
      }
    }
  };
};
