var fs = require('fs'),
    vixen = require('vixen');

//function xhr(url, callback) {
//  var r = new XMLHttpRequest(),
//      done = false;
//  r.open('GET', url, true);
//  r.onreadystatechange = function () {
//    var status;
//    if (done || r.readyState != 4) return;
//    done = true;
//    status = r.status != 200 && r.status != 0 ? r.status : null;
//    callback(r.status, r.responseText);
//  };
//  r.onerror = function() {
//    callback(r.status);
//  }
//  r.send();
//}

function xhr(url, callback) {
  var r = new XMLHttpRequest();
  if ('withCredentials' in r)
    r.open('GET', url, true);
  else if (typeof XDomainRequest != 'undefined') {
    r = new XDomainRequest();
    r.open(method, url);
  } else return;
  r.onload = function() {
    callback(r.status == 200 || r.status == 0 ? null : r.status,
             r.responseText);
  };
  r.onerror = function() { callback(r.status); };
  r.send();
};

module.exports = view;

view.defaultModel = {};
if (typeof window !== 'undefined') view.window = window;
view.readPath = fs.readFile ?
  function(path, done) {
    fs.readFile(path, {encoding:'utf8'}, done);
  } : xhr;


function view(opt, callback) {
  opt = opt || {};

  function done(err, html) {
    if (err) return callback(err);
    if (html != null) opt.el.innerHTML = html;
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
  opt.model = (function(a, b) {
    for (var i in b) if (!(i in a)) a[i] = b[i];
    return a;
  })(opt.model || {}, view.defaultModel);

  if (view.window && (!opt.el || typeof opt.el === 'string'))
    opt.el = view.window.document.createElement(opt.el || 'div');

  if (opt.id != null) opt.el.id = opt.id;
  if (opt.className != null) opt.el.className = opt.className;

  if (opt.path)
    view.readPath(opt.path, done);
  else
    done(null, opt.html);
}
