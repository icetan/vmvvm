var xhr = module.exports = function(opt, callback) {
  var r = new XMLHttpRequest,
      method = opt.type || 'POST';
  if ('withCredentials' in r)
    r.open(method, opt.url, true);
  else if (typeof XDomainRequest != 'undefined') {
    r = new XDomainRequest();
    r.open(method, opt.url);
  } else return;
  r.onreadystatechange = function() {
    if (r.readyState === 4) {
      if (r.status === 200) {
        return callback(void 0, r.responseText, r);
      } else {
        return callback(r.statusText, r.responseText, r);
      }
    }
  };
  r.setRequestHeader('Content-type', opt.contentType || 'text/plain');
  return r.send(opt.data);
};

xhr.json = function(opt, callback) {
  function callback_(err, json, xhr) {
    var data, err_;
    if ((err != null) || !json) return callback(err, void 0, xhr);
    try {
      data = JSON.parse(json);
    } catch (_error) {
      err_ = _error;
      err = err_;
    }
    return callback(err, data, xhr);
  }
  opt.data = JSON.stringify(opt.data);
  opt.contentType = 'application/json';
  return xhr(opt, callback_);
};

xhr.form = function(form, filter, callback) {
  if (callback == null) {
    callback = filter;
    filter = function(k, v) {
      return v;
    };
  }
  return form.addEventListener('submit', function(e) {
    var el, i, opt;

    opt = {
      url: form.action,
      data: ((function() {
        var _i, _ref, _results;

        _results = [];
        for (i = _i = 0, _ref = form.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if ((el = form[i]).value) {
            _results.push("" + el.name + "=" + (encodeURIComponent(filter(el.name, el.value))));
          }
        };
        return _results;
      })()).join('&'),
      contentType: 'application/x-www-form-urlencoded'
    };
    xhr(opt, callback);
    return e.preventDefault();
  });
};

xhr.get = function(opt, callback) {
  if (typeof opt === 'string') opt = {
    url: opt
  };
  opt.type = 'GET';
  xhr(opt, callback);
};
