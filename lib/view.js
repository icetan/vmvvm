var vixen = require('vixen');

module.exports = view;
module.exports.defaultModel = {};

function xhr(url, callback) {
  var r = new XMLHttpRequest(), done = false;
  r.open('GET', url, true);
  r.onreadystatechange = function () {
    if (done || r.readyState != 4) return;
    done = true;
    if (r.status != 200 && r.status != 0)
      callback(r);
    else
      callback(null, r.responseText);
  };
  r.send();
}

function view(opt, callback) {
  function done(html) {
    opt.el.innerHTML = html;
    callback(null, {
      el: opt.el,
      model: vixen(opt.el, opt.model),
      appendTo: function(to) {
        to.appendChild(this.el);
        return this;
      }
    });
  }

  // Override default view model with given model.
  opt.model = (function(b, c) {
    var i, a = {};
    for (i in b) a[i] = b[i];
    for (i in c) a[i] = c[i];
    return a;
  })(view.defaultModel, opt.model || {});

  if (typeof window !== 'undefined' && (!opt.el || typeof opt.el === 'string'))
    opt.el = window.document.createElement(opt.el || 'div');

  if (opt.id != null) opt.el.id = opt.id;
  if (opt.className != null) opt.el.className = opt.className;

  if (opt.html)
    done(opt.html);
  else if (opt.path)
    //require('fs').readFile(require.resolve(opt.path), 'utf8', function(html) {
    xhr(opt.path, function(err, html) {
      if (err) return callback(err);
      done(html);
    });
}
