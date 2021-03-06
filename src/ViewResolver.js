import { Compiler, compoNode } from "./ViewCompiler";
import { blank, each, slice } from "./ViewLang";
import { View } from "./ViewIndex";
import { code, codex } from "./ViewScope";
import { $word } from "./ViewExpress";

export var resolver = {
  view: function (view, node, scope, content, we) {
    try {
      var doc = document.createDocumentFragment();
      new Compiler(doc, scope, slice(node.children), content, we);
      content.children = node.children;
      content.clas = node.clas;
      view.reappend(doc);
    } catch (error) {
      console.error(error)
    }
  },
  component: function (node, we) {
    try {
      let app = code(node.clas.nodeValue, node.scope, we);
      app.model = app.model.$target || app.model;
      if (blank(app)) return;
      Reflect.setPrototypeOf(app.model, node.scope);
      var insert = insertion(node.childNodes);
      var childNodes = node.content.childNodes;
      clearNodes(node.childNodes);
      let component = new View({ view: app.view, model: app.model, action: app.action });
      app.model = component.model;
      let clasNodes = compoNode(insert, node, component);
      setCache(clasNodes, we, node.clas.nodeValue);
      childNodes.replace(node, clasNodes);
      if (insert.parentNode)
        insert.parentNode.replaceChild(component.view, insert);
    } catch (error) {
      console.error(error)
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
    } catch (error) {
      console.error(error)
    }
  },
  each: function (node, we) {
    try {
      var insert = insertion(node.childNodes);
      var doc = document.createDocumentFragment();
      var childNodes = node.content.childNodes;
      clearNodes(node.childNodes);
      new Compiler(doc, node.scope, [node], node.content, we);
      childNodes.replace(node, childNodes.pop())
      if (insert.parentNode)
        insert.parentNode.replaceChild(doc, insert);
    } catch (error) {
      console.error(error)
    }
  },
  arrayEach: function (node, we, index, nodes) {
    try {
      var insert = insertNode([node.childNodes[index]]);
      var doc = document.createDocumentFragment();
      var child = { clas: node.clas, children: node.children, scope: node.scope };
      var content = { childNodes: [], children: [] };
      new Compiler(doc, node.scope, [child], content, we);
      doc.removeChild(doc.childNodes[0]);
      var childNodes = slice(content.childNodes[0].childNodes);
      childNodes.splice(0, 1, index + 1, 0);
      node.childNodes.splices(childNodes);
      nodes.remove(content.childNodes[0]);
      if (insert.parentNode) insert.after(doc);
    } catch (error) {
      console.error(error)
    }
  },
  express: function (node, we) {
    try {
      node.node.nodeValue = codex(node.clas.nodeValue, node.scope, we);
      setCache(node, we, node.clas.nodeValue);
      if (node.node.name == "value")
        node.node.ownerElement.value = node.node.nodeValue;
    } catch (error) {
      console.error(error)
    }
  },
  attribute: function (node, we) {
    try {
      var newNode = document.createAttribute(codex(node.clas.name, scope, we));
      setCache(node, we, node.clas.name);
      newNode.nodeValue = node.clas.nodeValue;
      node.node.ownerElement.setAttributeNode(newNode);
      node.node.ownerElement.removeAttributeNode(node.node);
    } catch (error) {
      console.error(error)
    }
  }
};

export var cacher = function (cache, index, add) {
  cache.forEach((nodes, we) => {
    nodes.forEach(node => {
      try {
        if (arrayEach[node.resolver])
          arrayEach[node.resolver](node, we, nodes, index, add);
        else
          resolver[node.resolver](node, we, cache);
      } catch (error) {
        console.error(error);
      }
    })
  });
};

var arrayEach = {
  each: function (node, we, children, index, add) {
    try {
      if (add > 0) {
        resolver.arrayEach(node, we, index, children);
      }
      else {
        var nodes = node.childNodes.splice(index + 1);
        clearNodes(nodes);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export function setCache(clas, we, express) {
  express.replace($word, word => {
    if (!word.match(/["']/)) {
      let caches = new Function('scope', `return scope.${word}$;`)(clas.scope)
      if (caches != undefined) {
        let cache = caches.get(we);
        cache ? cache.ones(clas) : caches.set(we, [clas]);
      }
    }
  });
}

function insertion(nodes, node) {
  try {
    each(nodes, child => {
      if (child.node && child.node.parentNode) {
        node = child.node;
        child.node = null;
        return node;
      };
      node = insertion(child.childNodes);
    });
    return node;
  } catch (error) {
    console.error(error)
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
  } catch (error) {
    console.error(error)
  }
}

export function clearNodes(nodes) {
  nodes.forEach(function (child) {
    if (child.node && child.node.parentNode)
      return child.node.parentNode.removeChild(child.node);
    if (child.childNodes)
      clearNodes(child.childNodes);
  });
}