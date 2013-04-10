var crypto = require('crypto'),

    // Vixen MVVM modules
    router = require('../../lib/router'),
    view = require('../../lib/view'),
    Log = require('../../lib/log'),

    main;

// Setup default chaining functions for views.
view.defaultModel = {
  gravatar: function(email) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(email.trim().toLowerCase());
    return 'http://www.gravatar.com/avatar/'+md5sum.digest('hex')+
      '?d=identicon&s=200';
  }
};

module.exports = main = {
  // Init for main.
  init: function(window) {
    var body = window.document.getElementsByTagName('body')[0];

    function hashchange(e) {
      var hash = window.location.hash.substr(1);
      main.route(hash)(function(el) {
        body.innerHTML = '';
        body.appendChild(el);
      });
    }

    main.logger.on('log', function(log) {
      main.logs.push(log);
    });

    window.addEventListener('hashchange', hashchange);
    hashchange();
  },

  // Setup routes.
  route: router({
    //'item/(.*)': function (id) {
    //  return require('./item').bind(undefined, id);
    //},
    //'item': function () {
    //  return require('./items');
    //},

    // Default view, matches all paths
    '.*': function () {
      return require('./login');
    }
  }),

  // Setup a logger to log to memory.
  logs: [],
  logger: new Log()
};

main.init(window);
