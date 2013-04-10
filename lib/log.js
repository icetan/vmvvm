var util = require('util'),
    EventEmitter = require('events').EventEmitter;

module.exports = Log;

util.inherits(Log, EventEmitter);

function Log(levels) {
  var this_ = this,
      levels = levels || ['fatal', 'error', 'warning', 'info', 'debug'];
  this._levels = {};
  this.level = levels.length - 1;
  levels.forEach(function(type, i) {
    this_._levels[type] = i;
    this_[type] = Log.prototype.log.bind(this_, type);
  });
}

Log.prototype.getLevel = function(type) {
  return this._levels[type];
};

Log.prototype.filter = function(log) {
  return log.level <= this.level;
};

Log.prototype.log = function(type) {
  var data = {
    date: new Date(),
    section: this.section,
    type: type,
    level: this.getLevel(type)
  };
  if (!this.filter(data)) return;
  data.msg = util.format.apply(util, Array.prototype.slice.call(arguments, 1));
  this.emit('log', data);
};

Log.prototype.section = function(name) {
  var this_ = this,
      logger = new Log(Object.keys(this._levels));
  logger.section = name;
  logger.on('log', function(log) {
    if (this_.filter(log)) this_.emit('log', log);
  });
  return logger;
};
