var view = require('../../lib/view'),
    main = require('./main'),

    logger = main.logger.section('item');

module.exports = function(id, callback) {
  logger.debug('Your on the item#%d view son.', id);

  view({
    el: 'div',
    path: './item.html',
    model: {
      id: id
    }
  }, function(err, view) { callback(view.el); });
};
