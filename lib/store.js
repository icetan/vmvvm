module.exports = function(keyval) {
  var cache = {};

  function _store(ns, key, value) {
    if (typeof value === 'undefined') {
      return JSON.parse(keyval[ns+':'+key] || null);
    }
    return keyval[ns+':'+key] = JSON.stringify(value);
  }

  function createNS(ns) {
    var nsCache = cache[ns] = cache[ns] || {};

    function store(key, value) {
      return (typeof value === 'undefined') ?
        (key in nsCache ? nsCache[key] : (nsCache[key] = _store(ns, key))) :
        nsCache[key] = value;
    }

    store.extend = function(key, obj) {
      return store(key, (function(a, b) {
        for(var i in b) a[i] = b[i]; return a;
      })(store(key) || {}, obj));
    };

    store.has = function(key) {
      return (ns+':'+key) in keyval;
    };

    store.keys = function() {
      return Object.keys(keyval).filter(function(key) {
        return key.indexOf(ns+':') === 0;
      }).map(function(key) {
        return key.substr(ns.length+1);
      });
    };

    store.persist = function(key) {
      if (key == null)
        Object.keys(nsCache).forEach(function(key) {
          _store(ns, key, nsCache[key]);
        });
      else if (key in nsCache)
        _store(ns, key, nsCache[key]);
    };

    store.reset = function(key) {
      if (key == null)
        nsCache = cache[ns] = {};
      else if (key in nsCache)
        delete nsCache[key];
    };

    return store;
  };

  createNS.persist = function() {
    Object.keys(cache).forEach(function(ns) {
      var nsCache = cache[ns];
      Object.keys(nsCache).forEach(function(key) {
        _store(ns, key, nsCache[key]);
      });
    });
  };

  return createNS;
};
