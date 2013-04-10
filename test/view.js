var test = require('tap').test,
    jsdom = require('jsdom'),

    view = require('../lib/view');

test('should create an empty div if no paramaters given', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    global.window = window;
    var v = view();
    t.equal(v.el.tagName, 'DIV');
    t.ok(v.el instanceof window.HTMLElement);
  });
  t.plan(2);
});

test('should create an empty element of type specified as first param', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    global.window = window;
    var v = view('span');
    t.equal(v.el.tagName, 'SPAN');
    t.ok(v.el instanceof window.HTMLElement);
    v = view('h1');
    t.equal(v.el.tagName, 'H1');
    t.ok(v.el instanceof window.HTMLElement);
  });
  t.plan(4);
});

test('should create an empty element of type specified with named params', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    global.window = window;
    var div = window.document.createElement('div'),
        v;
    div.innerHTML = 'lol rofl';
    v = view({el: div});
    t.equal(v.el, div);
    t.equal(v.el.textContent, 'lol rofl');
    v = view({el:'span', html:'hej på dig'});
    t.ok(v.el instanceof window.HTMLElement);
    t.equal(v.el.tagName, 'SPAN');
    t.equal(v.el.textContent, 'hej på dig');
  });
  t.plan(5);
});

test('should extend view model with model param', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    global.window = window;
    var v = view('div', '{{lol}}', {lol: 'rofl'});
    t.equal(v.el.textContent, 'rofl');
    t.equal(v.model.lol, 'rofl');
    v = view({el:'div', html:'{{lol}}', model:{lol: 'rofl2'}});
    t.equal(v.el.textContent, 'rofl2');
    t.equal(v.model.lol, 'rofl2');
  });
  t.plan(4);
});
