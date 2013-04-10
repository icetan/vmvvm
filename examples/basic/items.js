var view = require('../../lib/view'),
    main = require('./main'),

    logger = main.logger.section('item');

module.exports = function(callback) {
  logger.debug('Your on the items view son.');

  view({
    el: 'div',
    path: './items.html',
    model: {
      items: [
        {name:'Apa', id:123},
        {name:'Hest', id:4231}
      ]
    }
  }, function(err, view) { callback(view.el); });
};
