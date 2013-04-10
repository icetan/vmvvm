var view = require('../../lib/view'),
    main = require('./main'),

    logger = main.logger.section('login');

module.exports = function(callback) {
  var username, password;

  logger.debug('Your on the login view %j son.', {asd:213})

  view({
    el: 'div',
    path: './template.html',
    model: {
      email: 'c.freden@gmail.com'
    }
  }, function(err, view) { callback(view.el); });
};
