function whiles(obj, methd, me) {
  while (obj.length) {
    var data = obj[0];
    if (methd.call(me, data, obj))
      break;
  }
}

function each(obj, methd, arg) {
  if (!obj) return;
  arg = arg || obj;
  Object.keys(obj).every(i => {
    var data = obj[i];
    return !methd.call(data, data, i, arg);
  });
  return arg;
}

function forEach(obj, methd, me) {
  if (!obj) return;
  if (obj.hasOwnProperty("$index")) {
    for (let i = obj.$index; i < obj.$length; i++) {
      methd.call(me, obj[i], i);
    }
  } else {
    Object.keys(obj).forEach(i => {
      methd.call(me, obj[i], i);
    });
  }
}

function slice(obj) {
  return [].slice.call(obj);
}

function inject(methds, parent) {
  if (methds) 
  Object.values(methds).forEach(methd => {
    let root = Object.assign({}, parent);
    root.__proto__ = Function.__proto__;
    methd.__proto__ = root;
  });
}

function extention(object, parent) {
  object.__proto__ = parent;
  return object;
}

function extend(object, src) {
  var prototype = object.prototype || object.__proto__;
  Object.keys(src).forEach(key => {
    prototype[key] = src[key];
  });
  return object;
}

function blank(str) {
  return str == null || str == undefined || str == "";
}

function clone(value) {
  if (value instanceof Boolean ||
    value instanceof String ||
    value instanceof Number ||
    value instanceof Date ||
    value instanceof View) {
    return value;
  } else if (Array.isArray(value)) {
    const obj = [];
    Object.keys(value).forEach(key => {
      obj[key] = clone(value[key]);
    });
    return obj;
  }
  else if (value && typeof value === 'object') {
    const obj = {};
    Object.keys(value).forEach(key => {
      obj[key] = clone(value[key]);
    });
    return obj;
  }
  return value;
}

if (!Object.values) {
  extend(Object, {
    values(object) {
      let values = [];
      Object.keys(object).forEach(key => {
        values.push(object[key]);
      });
      return values;
    }
  });
}

extend(Array, {
  remove(n) {
    var index = this.indexOf(n);
    if (index > -1)
      this.splice(index, 1);
    return this;
  },
  replace(o, n) {
    var index = this.indexOf(o);
    if (index > -1)
      this.splice(index, 1, n);
  },
  splices(items) {
    this["splice"].apply(this, items);
  },
  has(o) {
    var index = this.indexOf(o);
    if (index > -1)
      return true;
    return false
  },
  ones(o) {
    if (this.has(o)) return;
    this.push(o);
  }
});

var $lang = /((@each|@when|\.when)\s*\((.*)\)\s*\{|\{\s*([^\{\}]*)\s*\}|\s*\}\s*|\.when\s*\{)/g;
var $chen = /(@each|@when|\.when)\s*\((.*)\)\s*\{|\.when\s*\{/;
var $each = /(@each)\s*\((.*)\)\s*\{/g;
var $when = /(@when|\.when)\s*\((.*)\)\s*\{|\.when\s*\{/g;
var $whec = /\.when\s*\((.*)\)\s*\{|\.when\s*\{/g;
var $whea = /@when/g;
var $express = /\{\s*@?([^\{\}]*)\s*\}/;
var $expres = /\{\s*([^\{\}]*)\s*\}/g;
var $component = /\{\s*\s*@([^\{\}]*)\s*\}/;
var $close = /(^\s*\}\s*$)/;
var $word = /(\w+)((\.\w+)|(\[(.+)\]))*/g;
var $event = /^@(.*)/;

function init(dom) {
  each(dom, function (node) {
    if (node.childNodes[0] && !(/(CODE|SCRIPT)/).test(node.nodeName))
      init(slice(node.childNodes));
    if (node.nodeType == 3)
      node.nodeValue.replace($lang, function (tag) {
        var nodes = node.nodeValue.split(tag);
        node.parentNode.insertBefore(document.createTextNode(nodes[0]), node);
        node.parentNode.insertBefore(document.createTextNode(tag.trim()), node);
        node.nodeValue = node.nodeValue.replace(nodes[0], "").replace(tag, "");
      });
  });
  return dom;
}

function initCompiler(node, children) {
  let list = children || [];
  whiles(node, function (child) {
    node.shift();
    if (new RegExp($close).test(child.nodeValue)) return true;
    var item = { clas: child.cloneNode(true), children: [] };
    if (!(child.nodeType == 3 && child.nodeValue.trim() == "")) list.push(item);
    if (child.nodeType == 1) {
      initCompiler(slice(child.childNodes), item.children);
    }
    else if (new RegExp($chen).test(child.nodeValue)) {
      initCompiler(node, item.children);
    }  });
  return list;
}

function observe(target, callSet, callGet) {

  function observer(object, root, oldObject) {
    if (object instanceof View) return;
    if (Array.isArray(object)) array(object, root);
    if (typeof object == "object") {
      Object.keys(object).forEach(prop => {
        walk(object, prop, root, oldObject);
      });
    }
  }

  function walk(object, prop, root, oldObject) {
    var path = root ? `${root}.${prop}` : prop;
    var value = object[prop];
    if (value instanceof View) {
      watcher(object, prop, path);
    }
    else if (typeof value == "object" && oldObject != undefined) {
      observer(value, path, oldObject[prop]);
      watcher(object, prop, path);
    }
    else if (typeof value == "object") {
      observer(value, path);
      watcher(object, prop, path);
    }
    else if (oldObject != undefined) {
      var cache = watcher(object, prop, path);
      var oldValue = oldObject[prop];
      var oldCache = global.$cache;
      mq.publish(target, "set", [oldCache, cache]);
    }
    else {
      watcher(object, prop, path);
    }
  }

  function watcher(object, prop, path) {
    var value = object[prop], cache = new Map();
    Object.defineProperty(object, prop, {
      get() {
        mq.publish(target, "get", [path]);
        global.$cache = cache;
        return value;
      },
      set(val) {
        var oldValue = value;
        var oldCache = cache;
        cache = new Map();
        observer(value = clone(val), path, oldValue);
        mq.publish(target, "set", [oldCache, cache]);
      }
    });
  }

  const meths = ["shift", "push", "pop", "splice", "unshift", "reverse"];
  function array(object, root) {
    meths.forEach(function (name) {
      var method = Array.prototype[name];
      switch (name) {
        case "shift":
          Object.defineProperty(object, name, {
            writable: true,
            value: function () {
              var data = method.apply(this, arguments);
              cacher(getCache(), this);
              return data;
            }
          });
          break;
        case "pop":
          Object.defineProperty(object, name, {
            writable: true,
            value: function () {
              var data = method.apply(this, arguments);
              cacher(getCache(), this);
              return data;
            }
          });
          break;
        case "splice":
          Object.defineProperty(object, name, {
            writable: true,
            value: function (i, l) {
              if (0 < this.length) {
                let length = this.length;
                var data = method.apply(this, arguments);
                if (arguments.length > 2) {
                  var index = this.$index = length;
                  this.$length = this.length;
                  while (index < this.$length) walk(this, index++, root);
                }
                cacher(getCache(), this, arguments.length - 2);
                delete this.$index; delete this.$length;
                return data;
              }
            }
          });
          break;
        case "unshift":
          Object.defineProperty(object, name, {
            writable: true,
            value: function (i, l) {
              if (0 < this.length) {
                let length = this.length;
                var data = method.apply(this, arguments);
                var index = this.$index = length;
                this.$length = this.length;
                while (index < this.$length) walk(this, index++, root);
                cacher(getCache(), this, arguments.length);
                delete this.$index; delete this.$length;
                return data;
              }
            }
          });
          break;
        case "push":
          Object.defineProperty(object, name, {
            writable: true,
            value: function (i) {
              let index = this.length;
              var data = method.call(this, i);
              this.$index = index, this.$length = this.length;
              while (index < this.length) walk(this, index++, root);
              cacher(getCache(), this, 1);
              delete this.$index; delete this.$length;
              return data;
            }
          });
          break;
        case "reverse":
          Object.defineProperty(object, name, {
            writable: true,
            value: function (i) {
              var data = method.apply(this, arguments);
              return data;
            }
          });
          break;
        default:
          Object.defineProperty(object, name, {
            writable: true,
            value: function () {
              var data = method.apply(this, arguments);
              notify([]);
              return data;
            }
          });
          break;
      }
    });
    function notify(parm) {
      new Function('scope', 'val',
        `
        scope${Path(root)}=val;
        `
      )(target, object);
    }
    function getCache() {
      new Function('scope',
        `
        return scope${Path(root)};
        `
      )(target);
      return global.$cache;
    }
  }

  mq.subscribe(target, "set", callSet);
  mq.subscribe(target, "get", callGet);

  observer(target);
}

class Mess {
  constructor() {
    this.map = new Map();
  }
  publish(scope, event, data) {
    const cache = this.map.get(scope);
    if (cache) {
      let action = cache.get(event);
      if (action) {
        action.data.push(data);
      }
      else {
        cache.set(event, { data: [data], queue: [] });
      }
    }
    else {
      let data = new Map();
      data.set(event, { data: [data], queue: [] });
      this.map.set(scope, data);
    }
    this.notify(cache.get(event));
  }

  notify(action) {
    if (action) {
      while (action.data.length) {
        const data = action.data.shift();
        action.queue.forEach(function (call) {
          call(data[0], data[1], data[2]);
        });
      }
    }
    else {
      this.map.forEach(function (cache) {
        cache.forEach(function (action) {
          while (action.data.length) {
            const data = action.data.shift();
            action.queue.forEach(function (call) {
              call(data[0], data[1], data[2]);
            });
          }
        });
      });
    }
  }

  subscribe(scope, event, call) {
    const cache = this.map.get(scope);
    if (cache) {
      const action = cache.get(event);
      if (action) {
        action.queue.push(call);
      }
      else {
        cache.set(event, { data: [], queue: [call] });
      }
    }
    else {
      let data = new Map();
      data.set(event, { data: [], queue: [call] });
      this.map.set(scope, data);
    }
  }
}

var mq = new Mess();

function watcher(target, object, prop, path) {
  var value = object[prop], cache = new Map();
  Object.defineProperty(object, prop, {
    get() {
      mq.publish(target, "get", [path]);
      global.$cache = cache;
      return value;
    },
    set(val) {
      var oldCache = cache;
      cache = new Map();
      value = val;
      mq.publish(target, "set", [oldCache, cache]);
    }
  });
}

function codec(_express, _scope, we) {
  try {
    global.$path = undefined;
    global.$cache = undefined;
    _express = _express.replace($express, "$1");
    let value = codecc(_express, _scope, we);
    if (value) return value;
    value = Code(_express)(we.flux);
    if (value) return value;
    return Code(_express)(we.components);
  } catch (e) {
    return undefined;
  }
}

function codecc(_express, _scope, we) {
  try {
    let express = _express.split(":"), value;
    if (express.length < 2) return;
    value = Codex(express[0], extention({ flux: we.flux }, _scope));
    if (value) return value;
    let props = express[0].replace("flux", "");
    let comp = express[1];
    return codeccc(props, comp, _scope, we)
  } catch (e) {
    return undefined;
  }
}

function codeccc(props, comp, scope, we) {
  try {
    let value = we.flux;
    let expres = props.match(/(\w+)/g);
    let prop = scope[expres.pop()];
    expres.forEach(prop => value = value[scope[prop]] || (value[scope[prop]] = {}));
    value[prop] = we.components[comp];
    watcher(we.flux, value, prop);
    return value[prop];
  } catch (e) {
    return undefined;
  }
}

function code(_express, _scope) {
  try {
    global.$path = undefined;
    global.$cache = undefined;
    return Code(_express)(_scope);
  } catch (e) {
    return undefined;
  }
}

function codex(_express, _scope) {
  try {
    _express = `'${_express.replace($expres, "'+($1)+'")}'`;
    return Code(_express)(_scope);
  } catch (e) {
    return undefined;
  }
}

function Code(_express) {
  return new Function('_scope',
    `with (_scope) {
       return ${_express};
    }`
  );
}

function Codex(_express, _scope) {
  try {
    return Code(_express)(_scope);
  } catch (error) {
    return undefined;
  }
}

function Path(path) {
  try {
    return path.replace(/(\w+)\.?/g, "['$1']");
  } catch (e) {
    return undefined;
  }
}

function setVariable(scope, variable, path) {
  path = `${Path(path)}`;
  Object.defineProperty(scope, variable, {
    get() {
      return new Function('scope',
        `
        return scope${path};
        `
      )(scope);
    },
    set(val) {
      new Function('scope', 'val',
        `
        scope${path}=val;
        `
      )(scope, val);
    }
  });
}

function Compiler(node, scopes, childNodes, content, we) {

  function compiler(node, scopes, childNodes, content) {
    whiles(childNodes, function (child, childNodes) {
      if (child.clas.nodeType == 1) {
        if (child.clas.hasAttribute("each")) {
          var expreses = child.clas.getAttribute("each").split(":");
          var variable = expreses.shift().trim();
          var source = expreses.pop().trim();
          var id = expreses.shift();
          var dataSource = code(source, scopes);
          var clas = eachNode(null, node, child);
          content.childNodes.push(clas);
          binding.attrEach(null, scopes, clas, content, dataSource);
          forEach(dataSource, function (item, index) {
            var scope = Object.create(scopes || {});
            setVariable(scope, variable, global.$path);
            if (id) scope[id.trim()] = index.toString();
            var newNode = child.clas.cloneNode();
            newNode.removeAttribute("each");
            node.appendChild(newNode);
            var clasNodes = classNode(newNode, child);
            clas.childNodes.push(clasNodes);
            compiler(newNode, scope, slice(child.children), clasNodes);
            commom(newNode, scope, clasNodes, content);
          });
        }
        else {
          if ((/(CODE|SCRIPT)/).test(child.clas.nodeName)) {
            var newNode = child.clas.cloneNode(true);
            node.appendChild(newNode);
            var clasNodes = classNode(newNode, child);
            content.childNodes.push(clasNodes);
          }
          else {
            var newNode = child.clas.cloneNode();
            node.appendChild(newNode);
            var clasNodes = classNode(newNode, child);
            content.childNodes.push(clasNodes);
            compiler(newNode, scopes, slice(child.children), clasNodes);
            commom(newNode, scopes, clasNodes, content);
          }
        }
      }
      else {
        if ($each.test(child.clas.nodeValue)) {
          var expreses = child.clas.nodeValue.replace($each, "$2").split(":");
          var variable = expreses.shift().trim();
          var source = expreses.pop().trim();
          var id = expreses.shift();
          var dataSource = code(source, scopes);
          var clas = eachNode(null, node, child);
          content.childNodes.push(clas);
          binding.each(null, scopes, clas, content, dataSource);
          let children = slice(child.children);
          forEach(dataSource, function (item, index) {
            var scope = Object.create(scopes || {});
            setVariable(scope, variable, global.$path);
            if (id) scope[id.trim()] = index.toString();
            var clasNodes = classNode(null, child);
            clas.childNodes.push(clasNodes);
            compiler(node, scope, slice(children), clasNodes);
          });
        }
        else if ($when.test(child.clas.nodeValue)) {
          var when = code(child.clas.nodeValue.replace($when, "$2"), scopes);
          var clas = whenNode(null, node, child, content, scopes);
          clas.children.push(childNodes.shift());
          if (when) {
            binding.when(null, scopes, clas, content);
            whiles(childNodes, function (child, childNodes) {
              if (!whem(child)) return true;
              clas.children.push(childNodes.shift());
            });
            whiles(slice(child.children), function (child, childNodes) {
              if (child.clas.nodeType == 1 || $chen.test(child.clas.nodeValue)) {
                compiler(node, scopes, childNodes, clas);
              }
              else {
                var newNode = child.clas.cloneNode();
                node.appendChild(newNode);
                var clasNodes = classNode(newNode, child);
                clas.childNodes.push(clasNodes);
                commom(newNode, scopes, clasNodes, clas);
              }
              childNodes.shift();
            });
          }
          else if (when == undefined) {
            binding.when(null, scopes, clas, content);
            whiles(slice(child.children), function (child, childNodes) {
              if (child.clas.nodeType == 1 || $chen.test(child.clas.nodeValue)) {
                compiler(node, scopes, childNodes, clas);
              }
              else {
                var newNode = child.clas.cloneNode();
                node.appendChild(newNode);
                var clasNodes = classNode(newNode, child);
                clas.childNodes.push(clasNodes);
                commom(newNode, scopes, clasNodes, clas);
              }
              childNodes.shift();
            });
          }
          else if (whem(childNodes[0])) {
            compiler(node, scopes, childNodes, clas);
          }
          return whem(child);
        }
        else {
          var newNode = child.clas.cloneNode();
          node.appendChild(newNode);
          var clasNodes = classNode(newNode, child);
          content.childNodes.push(clasNodes);
          commom(newNode, scopes, clasNodes, content);
        }
      }
      childNodes.shift();
    });
  }

  function attrExpress(node, scope) {
    forEach(node.attributes, function (child) {
      if(!child) return;
      let clas = attrNode(child, scope, child.cloneNode());
      if (new RegExp($expres).test(child.nodeValue)) {
        binding.attrExpress(child, scope, clas);
        child.nodeValue = codex(child.nodeValue, scope);
      }
      bind(child, scope);
    });

    function bind(node, scope) {
      node.name.replace($event, function (key) {
        key = key.replace($event, "$1");
        let owner = node.ownerElement;
        var array = node.nodeValue.toString().match(/\(([^)]*)\)/);
        if (array) {
          var name = node.nodeValue.toString().replace(array[0], "");
          let methd = code(name, we.action);
          owner.on(key, methd, scope, array[1]);
        }
        else {
          let methd = code(node.nodeValue, we.action);
          owner.on(key, methd, scope);
        }
      });
    }
  }

  function commom(node, scope, clas, content) {
    let express;
    attrExpress(node, scope);
    if (new RegExp($component).test(node.nodeValue)) {
      comNode(node, scope, clas, content);
      resolver["component"](clas, we);
    }
    else if (express = new RegExp($express).exec(node.nodeValue)) {
      binding.express(node, scope, clas, express[0]);
      node.nodeValue = code(express[1], scope);
    }
  }

  function whem(child) {
    if (child) return new RegExp($whec).test(child.clas.nodeValue);
  }

  let binding = {
    attrEach(node, scope, clas, content) {
      if (global.$cache == undefined) return;
      clas.resolver = "each";
      clas.content = content;
      clas.scope = scope;
      clas.node = node;
      deeping(clas, we, global.$cache);
    },
    each(node, scope, clas, content) {
      if (global.$cache == undefined) return;
      clas.resolver = "each";
      clas.content = content;
      clas.scope = scope;
      clas.node = node;
      deeping(clas, we, global.$cache);
    },
    when(node, scope, clas) {
      var nodeValue = clas.clas.nodeValue;
      let whens = new RegExp($when).exec(nodeValue);
      if (!whens) return;
      let key = whens.pop();
      clas.resolver = "when";
      clas.scope = scope;
      clas.node = node;
      dep(key, scope, clas);
    },
    express(node, scope, clas, key) {
      clas.resolver = "express";
      clas.scope = scope;
      clas.node = node;
      dep(key, scope, clas);
    },
    attrExpress(node, scope, clas) {
      var nodeValue = clas.clas.nodeValue;
      nodeValue.replace($expres, function (key) {
        clas.resolver = "express";
        clas.scope = scope;
        clas.node = node;
        if (clas.clas.name == "model") return;
        dep(key, scope, clas);
      });
      if (clas.clas.name == "value" || clas.clas.name == "model")
        model(node, scope);
    }
  };

  function dep(key, scope, clas) {
    key.replace($word, function (key) {
      code(key, scope);
      if (global.$cache == undefined) return;
      deeping(clas, we, global.$cache);
    });
  }

  function model(node, scope) {
    let owner = node.ownerElement;
    owner._express = node.nodeValue.replace($express, "$1");
    let _express = `scope${Path(owner._express)}`;
    let methd = (input[owner.type] || input[owner.localName] || input.other);
    methd(node, scope, _express);
  }

  let input = {
    checkbox(node, scope, _express) {
      try {
        var owner = node.ownerElement;
        owner.on("change", function () {
          let _value = owner.value.replace(/(\'|\")/g, "\\$1");
          let express = `${_express}.${owner.checked ? "ones" : "remove"}('${_value}');`;
          new Function('scope', express)(scope);
        });
        let value = code(owner._express, scope);
        if (value.has(owner.value)) owner.checked = true;
      } catch (e) {
        console.log(e);
      }
    },
    radio(node, scope, _express) {
      try {
        var owner = node.ownerElement;
        owner.on("change", function () {
          let _value = owner.value.replace(/(\'|\")/g, "\\$1");
          let express = `${_express}='${_value}';`;
          new Function('scope', express)(scope);
        });
        let value = code(owner._express, scope);
        if (value == owner.value) owner.checked = true;
        owner.name = global.$path;
      } catch (error) {
        console.log(e);
      }
    },
    select(node, scope, _express) {
      try {
        var owner = node.ownerElement, handle;
        owner.on("change", handle = function () {
          let _value = owner.value.replace(/(\'|\")/g, "\\$1");
          let express = `${_express}='${_value}';`;
          new Function('scope', express)(scope);
        });
        let value = code(owner._express, scope);
        blank(value) ? handle() : owner.value = value;
      } catch (error) {
        console.log(e);
      }
    },
    other(node, scope, _express) {
      try {
        var owner = node.ownerElement;
        owner.on("change", function () {
          let _value = owner.value.replace(/(\'|\")/g, "\\$1");
          let express = `${_express}='${_value}';`;
          new Function('scope', express)(scope);
        });
      } catch (error) {
        console.log(e);
      }
    }
  };

  function classNode(newNode, child) {
    return {
      node: newNode,
      clas: child.clas,
      children: child.children,
      scope: child.scope,
      childNodes: []
    };
  }

  function eachNode(newNode, node, child) {
    var comment = document.createComment("each:" + global.$path);
    node.appendChild(comment);
    return {
      node: newNode,
      clas: child.clas,
      children: child.children,
      scope: child.scope,
      childNodes: [{
        node: comment,
        clas: child.clas,
        children: [],
        scope: child.scope,
        childNodes: []
      }]
    };
  }

  function whenNode(newNode, node, child, content, scopes) {
    if (new RegExp($whea).test(child.clas.nodeValue)) {
      var comment = document.createComment("when:" + global.$path);
      node.appendChild(comment);
      content.childNodes.push(content = {
        node: newNode,
        clas: child.clas,
        children: [],
        scope: child.scope,
        content: content,
        childNodes: [{
          node: comment,
          clas: child.clas,
          children: [],
          scope: child.scope,
          childNodes: []
        }]
      });
      binding.when(null, scopes, content);
    }
    return content;
  }

  function comNode(node, scope, clas, content) {
    var comment = document.createComment("component");
    node.parentNode.replaceChild(comment, node);
    clas.scope = scope;
    clas.resolver = "component";
    clas.content = content;
    clas.childNodes.push({
      node: comment,
      children: [],
      content: clas,
      childNodes: []
    });
  }

  function attrNode(newNode, scope, clas) {
    return {
      node: newNode,
      clas: clas,
      children: [],
      scope: scope,
      childNodes: []
    };
  }

  compiler(node, scopes, childNodes, content);

}

function compoNode(node, child, component) {
  var comment = document.createComment("component:" + child.path);
  node.before(comment);
  component.content.node = component.view;
  return {
    clas: child.clas,
    children: [component.node],
    scope: child.scope,
    resolver: child.resolver,
    content: child.content,
    childNodes: [{
      node: comment,
      children: [],
      scope: child.scope,
      childNodes: []
    }, component.content]
  };
}

var resolver = {
  view: function (view, node, scope, content, we) {
    try {
      var doc = document.createDocumentFragment();
      new Compiler(doc, scope, slice(node.children), content, we);
      content.children = node.children;
      content.clas = node.clas;
      view.reappend(doc);
    } catch (e) {
      console.log(e);
    }
  },
  component: function (node, we) {
    try {
      let app = codec(node.clas.nodeValue, node.scope, we);
      let $cache = global.$cache;
      if (blank(app)) return;
      extention(app.model, node.scope);
      var insert = insertion(node.childNodes);
      var childNodes = node.content.childNodes;
      clearNodes(node.childNodes);
      let component = new View({ view: app.component, model: app.model, action: app.action });
      let clasNodes = compoNode(insert, node, component);
      deeping(clasNodes, we, $cache);
      childNodes.replace(node, clasNodes);
      if (insert.parentNode)
        insert.parentNode.replaceChild(component.view, insert);
    } catch (e) {
      console.log(e);
    }
  },
  when: function (node, we) {
    try {
      var insert = insertion(node.childNodes);
      var doc = document.createDocumentFragment();
      var childNodes = node.content.childNodes;
      clearNodes(node.childNodes);
      new Compiler(doc, node.scope, slice(node.children), node.content, we);
      childNodes.replace(node, childNodes.pop());
      if (insert.parentNode)
        insert.parentNode.replaceChild(doc, insert);
    } catch (e) {
      console.log(e);
    }
  },
  each: function (node, we) {
    try {
      var insert = insertion(node.childNodes);
      var doc = document.createDocumentFragment();
      var childNodes = node.content.childNodes;
      clearNodes(node.childNodes);
      new Compiler(doc, node.scope, [node], node.content, we);
      childNodes.replace(node, childNodes.pop());
      if (insert.parentNode)
        insert.parentNode.replaceChild(doc, insert);
    } catch (e) {
      console.log(e);
    }
  },
  arrayEach: function (node, we, m, nodes) {
    try {
      var insert = insertNode([node.childNodes[m]]);
      var doc = document.createDocumentFragment();
      var child = { clas: node.clas, children: node.children, scope: node.scope };
      var content = { childNodes: [], children: [] };
      new Compiler(doc, node.scope, [child], content, we);
      doc.removeChild(doc.childNodes[0]);
      var childNodes = slice(content.childNodes[0].childNodes);
      childNodes.splice(0, 1, m + 1, 0);
      node.childNodes.splices(childNodes);
      nodes.remove(content.childNodes[0]);
      if (insert.parentNode) insert.after(doc);
    } catch (e) {
      console.log(e);
    }
  },
  express: function (node, we, cache) {
    try {
      node.node.nodeValue = codex(node.clas.nodeValue, node.scope);
      deeping(node, we, cache);
      if (node.node.name == "value")
        node.node.ownerElement.value = node.node.nodeValue;
    } catch (e) {
      console.log(e);
    }
  },
  attribute: function (node, we, cache) {
    try {
      var newNode = document.createAttribute(codex(node.clas.name, scope));
      deeping(node, we, cache);
      newNode.nodeValue = node.clas.nodeValue;
      node.node.ownerElement.setAttributeNode(newNode);
      node.node.ownerElement.removeAttributeNode(node.node);
    } catch (e) {
      console.log(e);
    }
  }
};

var cacher = function (cache, scope, add) {
  cache.forEach((nodes, we) => {
    nodes.forEach(node => {
      try {
        if (arrayEach[node.resolver])
          arrayEach[node.resolver](node, scope, add, we, nodes);
        else
          resolver[node.resolver](node, we, cache);
      } catch (e) {
        console.error(e);
      }
    });
  });
};

var arrayEach = {
  each: function (node, scope, add, we, children) {
    try {
      var l = scope.length;
      if (add > 0) {
        var nodes = node.childNodes.splice(l + 1);
        clearNodes(nodes);
        resolver.arrayEach(node, we, node.childNodes.length - 1, children);
      }
      else {
        var nodes = node.childNodes.splice(l + 1);
        clearNodes(nodes);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

function deeping(clas, we, $cache) {
  if (!$cache) return;
  let cache = $cache.get(we);
  if (cache) {
    cache.ones(clas);
  } else {
    $cache.set(we, [clas]);
  }
}

function insertion(nodes, node) {
  try {
    each(nodes, child => {
      if (child.node && child.node.parentNode) {
        node = child.node;
        child.node = null;
        return node;
      }      node = insertion(child.childNodes);
    });
    return node;
  } catch (e) {
    console.log(e);
  }
}

function insertNode(nodes, node) {
  try {
    each(nodes, child => {
      if (child.node && child.node.parentNode) {
        node = child.node;
        return node;
      }
      if (child.childNodes.length) {
        let children = child.childNodes[child.childNodes.length - 1];
        if (children.node && children.node.parentNode) {
          node = children.node;
          return node;
        }
        node = insertNode([children]);
      }
    });
    return node;
  } catch (e) {
    console.log(e);
  }
}

function clearNodes(nodes) {
  nodes.forEach(function (child) {
    if (child.node && child.node.parentNode)
      return child.node.parentNode.removeChild(child.node);
    if (child.childNodes)
      clearNodes(child.childNodes);
  });
}

function Router(app, params) {
  var $param = /^:/, $root = /^\/(.+)/;
  let router, para, routes;
  this.redreact = redreact;

  var supportsPushState = (function () {
    var userAgent = window.navigator.userAgent;
    if (
      (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) ||
      (userAgent.indexOf("Trident") > -1) ||
      (userAgent.indexOf("Edge") > -1)
    ) {
      return false
    }
    return window.history && 'pushState' in window.history
  })();

  function resolver(hash) {
    routes = Object.keys(params);
    while (routes.length) {
      router = routes.shift(), para = {};
      let routs = router.replace($root, "$1");
      routs = routs.split("/");
      let haths = hash.split("/");

      if (match(routs, haths)) return {
        component: params[router].component,
        router: params[router].router,
        action: params[router].action,
        after: params[router].after,
        params: para,
        path: hash
      }
    }
  }

  function match(routs, hashs) {
    while (hashs.length) {
      let name = routs.shift();
      let param = hashs.shift();
      if (param != name) {
        if (!$param.test(name)) {
          return false;
        }
        name = name.replace($param, "");
        para[name] = param;
      }
    }
    return true;
  }

  function redreact(path) {
    let url = window.location.pathname;
    window.location.href = url + "#" + path;
  }

  function action(event) {
    var hash = window.location.hash.replace(/^#\/?/, "");
    let router = resolver(hash);
    if (router) {
      router.action(router.params);
      app.model[router.router] = router.component;
      if (router.after) {
        router.after();
      }
    } else {
      if (event == undefined || event.type == "load") {
        redreact("");
      }
    }
  }

  window.addEventListener("load", action, action());
  window.addEventListener(supportsPushState ? "popstate" : "hashchange", action, false);

}

function query(express) {
  try {
    var doc = document.querySelectorAll(express);
    return doc;
  } catch (e) {
    var newNode = document.createElement("div");
    newNode.innerHTML = express.trim();
    return newNode.childNodes;
  }
}

function addListener(type, methods, scope) {
  if (this.addEventListener) {
    this.addEventListener(type, function (event) {
      methods.forEach((params, method) => {
        params.forEach(param => {
          var args = param ? code(`[${param}]`, scope) : [];
          args.push(event);
          method.apply(extention({
            $view: method.$view,
            $action: method.$action
          }, method.$model), args);
        });
      });
    }, false);
  }
  else if (this.attachEvent) {
    this.attachEvent('on' + type, function (event) {
      methods.forEach((params, method) => {
        params.forEach(param => {
          var args = param ? code(`[${param}]`, scope) : [];
          args.push(event);
          method.apply(extention({
            $view: method.$view,
            $action: method.$action
          }, method.$model), args);
        });
      });
    });
  }
  else {
    element['on' + type] = function (event) {
      methods.forEach((params, method) => {
        params.forEach(param => {
          var args = param ? code(`[${param}]`, scope) : [];
          args.push(event);
          method.apply(extention({
            $view: method.$view,
            $action: method.$action
          }, method.$model), args);
        });
      });
    };
  }
}

function removeListener(type, handler) {
  if (this.addEventListener) {
    this.removeEventListener(type, handler, false);
  }
  else if (this.detachEvent) {
    this.detachEvent('on' + type, handler);
  }
  else {
    element['on' + type] = null;
  }
}

extend(Node, {
  on: function (type, handler, scope, params) {
    if (this._manager) {
      if (this._manager.get(type)) {
        let methods = this._manager.get(type);
        if (methods.get(handler)) {
          methods.get(handler).ones(params);
        }
        else {
          methods.set(handler, [params]);
        }
      }
      else {
        let methods = new Map();
        methods.set(handler, [params]);
        this._manager.set(type, methods);
        addListener.call(this, type, methods, scope);
      }
    }
    else {
      let methods = new Map();
      methods.set(handler, [params]);
      this._manager = new Map();
      this._manager.set(type, methods);
      addListener.call(this, type, methods, scope);
    }
    return this;
  },
  off: function (type, handler) {
    if (this._manager) {
      let methods = this._manager.get(type);
      if (methods == undefined) return;
      methods.delete(handler);
      if (methods.size) return;
      this._manager.delete(type);
      removeListener.call(this, type, handler);
    }
    return this;
  },
  reappend(node) {
    each(slice(this.childNodes), function (child) {
      child.parentNode.removeChild(child);
    });
    this.appendChild(node);
    return this;
  },
  before(node) {
    this.parentNode.insertBefore(node, this);
  },
  after(node) {
    if (this.nextSibling)
      this.parentNode.insertBefore(node, this.nextSibling);
    else
      this.parentNode.appendChild(node);
  }
});
extend(NodeList, {
  on(type, call) {
    each(this, function (node) {
      node.on(type, call);
    });
    return this;
  },
  off(type, call) {
    each(this, function (node) {
      node.off(type, call);
    });
    return this;
  }
});

let global = { $path: undefined };

class View {
  constructor(app) {
    this.content = { childNodes: [], children: [] };
    this.model = app.model;
    this.action = app.action;

    observe(app.model, function set(cache, newCache) {
      deepen(cache, newCache);
    }, function get(path) {
      global.$path = path;
    });

    observe(app.flux, function set(cache, newCache) {
      deepen(cache, newCache);
    }, function get(path) {
      global.$path = path;
    });

    app.view ? this.view(app) : this.component(app);

  }
  view(app) {
    var view = query(app.view);
    var node = initCompiler(init(slice(view)))[0];
    this.node = node;
    this.view = view[0];
    this.flux = app.flux, this.components = app.components, inject(app.action, {
        $view: this.view,
        $model: app.model,
        $action: app.action
      });
    resolver["view"](this.view, node, app.model, this.content, this);
  }
  component(app) {
    var view = query(app.component);
    this.view = view[0];
    this.view.parentNode.removeChild(this.view);
    this.component = this.view.outerHTML;
  }
}

function clearNode(nodes, status) {
  try {
    nodes.every(child => {
      if (child.node) {
        let node = child.node.ownerElement || child.node;
        status = document.body.contains(node);
        return false;
      }      status = clearNode(child.childNodes);
    });
    return status;
  } catch (e) {
    console.log(e);
  }
}

function deepen(cache, newCache) {
  cache.forEach((nodes, we) => {
    slice(nodes).forEach(node => {
      if (clearNode([node]))
        resolver[node.resolver](node, we, newCache);
      else
        nodes.remove(node);
    });
  });
}

window.View = View;
window.Router = Router;
window.query = query;

export { global, View };
