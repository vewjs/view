var view=function(n){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function c(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function r(e,n,t){return n&&c(e.prototype,n),t&&c(e,t),e}function i(e,n,t){for(;e.length;){var o=e[0];if(n.call(t,o,e))break}}function a(e,n,t){if(e)return t=t||e,Object.keys(e).every(function(o){var c=e[o];return!n.call(c,c,o,t)}),t}function s(e,n,t){if(e)if(e.hasOwnProperty("$index"))for(var o=e.$index;o<e.$length;o++)n.call(t,e[o],o);else Object.keys(e).forEach(function(o){n.call(t,e[o],o)})}function l(e){return[].slice.call(e)}function u(e,n){return e.__proto__=n,e}function h(e,n){var t=e.prototype||e.__proto__;return Object.keys(n).forEach(function(e){t[e]=n[e]}),e}function d(e){return null==e||void 0==e||""==e}Object.values||h(Object,{values:function(e){var n=[];return Object.keys(e).forEach(function(t){n.push(e[t])}),n}}),h(Array,{remove:function(e){var n=this.indexOf(e);return n>-1&&this.splice(n,1),this},replace:function(e,n){var t=this.indexOf(e);t>-1&&this.splice(t,1,n)},splices:function(e){this.splice.apply(this,e)},has:function(e){return this.indexOf(e)>-1},ones:function(e){this.has(e)||this.push(e)}});var f=/((@each|@when|\.when)\s*\((.*)\)\s*\{|\{\s*([^\{\}]*)\s*\}|\s*\}\s*|\.when\s*\{)/g,p=/(@each|@when|\.when)\s*\((.*)\)\s*\{|\.when\s*\{/,v=/(@each)\s*\((.*)\)\s*\{/g,m=/(@when|\.when)\s*\((.*)\)\s*\{|\.when\s*\{/g,w=/\.when\s*\((.*)\)\s*\{|\.when\s*\{/g,g=/@when/g,y=/\{\s*@?([^\{\}]*)\s*\}/,N=/\{\s*([^\{\}]*)\s*\}/g,$=/\{\s*\s*@([^\{\}]*)\s*\}/,b=/(^\s*\}\s*$)/,x=/(\w+)((\.\w+)|(\[(.+)\]))*/g,E=/^@(.*)/;function _(e,n,o){function c(e,n){"object"==t(e)&&Object.keys(e).forEach(function(t){r(e,t,n)})}function r(n,t,o){var a,s=o?"".concat(o,".").concat(t):t,l=n[t],u=new Map;Object.defineProperty(n,t,{get:function(){return a=function(n,t,o){void 0==n&&(n=t,Array.isArray(n)&&function(n,t){function o(){return new Function("scope","\n        return scope".concat(S(t),";\n        "))(e),I.$cache}i.forEach(function(c){var i=Array.prototype[c];switch(c){case"shift":case"pop":Object.defineProperty(n,c,{writable:!0,value:function(){var e=i.apply(this,arguments);return P(o(),this),e}});break;case"splice":Object.defineProperty(n,c,{writable:!0,value:function(e,n){if(0<this.length){var c=this.length,a=i.apply(this,arguments);if(arguments.length>2){var s=this.$index=c;for(this.$length=this.length;s<this.$length;)r(this,s++,t)}return P(o(),this,arguments.length-2),delete this.$index,delete this.$length,a}}});break;case"unshift":Object.defineProperty(n,c,{writable:!0,value:function(e,n){if(0<this.length){var c=this.length,a=i.apply(this,arguments),s=this.$index=c;for(this.$length=this.length;s<this.$length;)r(this,s++,t);return P(o(),this,arguments.length),delete this.$index,delete this.$length,a}}});break;case"push":Object.defineProperty(n,c,{writable:!0,value:function(e){var n=this.length,c=i.call(this,e);for(this.$index=n,this.$length=this.length;n<this.length;)r(this,n++,t);return P(o(),this,1),delete this.$index,delete this.$length,c}});break;case"reverse":Object.defineProperty(n,c,{writable:!0,value:function(e){var n=i.apply(this,arguments);return n}});break;default:Object.defineProperty(n,c,{writable:!0,value:function(){var o=i.apply(this,arguments);return new Function("scope","val","\n        scope".concat(S(t),"=val;\n        "))(e,n),o}})}})}(n,o),c(n,o));return n}(a,l,s),I.$cache=u,V.publish(e,"get",[s]),a},set:function(n){l=n,a=void 0;var t=u;u=new Map,V.publish(e,"set",[t,u])}})}var i=["shift","push","pop","splice","unshift","reverse"];V.subscribe(e,"set",n),V.subscribe(e,"get",o),c(e)}var V=new(function(){function e(){o(this,e),this.map=new Map}return r(e,[{key:"publish",value:function(e,n,t){var o=this.map.get(e);if(o){var c=o.get(n);c?c.data.push(t):o.set(n,{data:[t],queue:[]})}else{var r=new Map;r.set(n,{data:[r],queue:[]}),this.map.set(e,r)}this.notify(o.get(n))}},{key:"notify",value:function(e){if(e)for(var n=function(){var n=e.data.shift();e.queue.forEach(function(e){e(n[0],n[1],n[2])})};e.data.length;)n();else this.map.forEach(function(e){e.forEach(function(e){for(var n=function(){var n=e.data.shift();e.queue.forEach(function(e){e(n[0],n[1],n[2])})};e.data.length;)n()})})}},{key:"subscribe",value:function(e,n,t){var o=this.map.get(e);if(o){var c=o.get(n);c?c.queue.push(t):o.set(n,{data:[],queue:[t]})}else{var r=new Map;r.set(n,{data:[],queue:[t]}),this.map.set(e,r)}}}]),e}());function O(e,n,t){try{I.$path=void 0,I.$cache=void 0;var o=function(e,n,t){try{var o,c=e.split(":");if(c.length<2)return;if(o=function(e,n){try{return k(e)(n)}catch(e){return}}(c[0],u({flux:t.flux},n)))return o;var r=c[0].replace("flux",""),i=c[1];return function(e,n,t,o){try{var c=o.flux,r=e.match(/(\w+)/g),i=t[r.pop()];return r.forEach(function(e){return c=c[t[e]]||(c[t[e]]={})}),c[i]=o.components[n],function(e,n,t,o){var c=n[t],r=new Map;Object.defineProperty(n,t,{get:function(){return V.publish(e,"get",[o]),I.$cache=r,c},set:function(n){var t=r;r=new Map,c=n,V.publish(e,"set",[t,r])}})}(o.flux,c,i),c[i]}catch(e){return}}(r,i,n,t)}catch(e){return}}(e=e.replace(y,"$1"),n,t);return o||((o=k(e)(t.flux))||k(e)(t.components))}catch(e){return}}function C(e,n){try{return I.$path=void 0,I.$cache=void 0,k(e)(n)}catch(e){return}}function j(e,n){try{return k(e="'".concat(e.replace(N,"'+($1)+'"),"'"))(n)}catch(e){return}}function k(e){return new Function("_scope","with (_scope) {\n       return ".concat(e,";\n    }"))}function S(e){try{return e.replace(/(\w+)\.?/g,"['$1']")}catch(e){return}}function F(e,n,t){t="".concat(S(t)),Object.defineProperty(e,n,{get:function(){return new Function("scope","\n        return scope".concat(t,";\n        "))(e)},set:function(n){new Function("scope","val","\n        scope".concat(t,"=val;\n        "))(e,n)}})}function T(n,t,o,c,r){function a(e,n){s(e.attributes,function(e){if(e){var t=function(e,n,t){return{node:e,clas:t,children:[],scope:n,childNodes:[]}}(e,n,e.cloneNode());new RegExp(N).test(e.nodeValue)&&(f.attrExpress(e,n,t),e.nodeValue=j(e.nodeValue,n)),function(e,n){e.name.replace(E,function(t){t=t.replace(E,"$1");var o=e.ownerElement,c=e.nodeValue.toString().match(/\(([^)]*)\)/);if(c){var i=e.nodeValue.toString().replace(c[0],""),a=C(i,r.action);o.on(t,a,n,c[1])}else{var s=C(e.nodeValue,r.action);o.on(t,s,n)}})}(e,n)}})}function u(e,n,t,o){var c;a(e,n),new RegExp($).test(e.nodeValue)?(!function(e,n,t,o){var c=document.createComment("component");e.parentNode.replaceChild(c,e),t.scope=n,t.resolver="component",t.content=o,t.childNodes.push({node:c,children:[],content:t,childNodes:[]})}(e,n,t,o),M.component(t,r)):(c=new RegExp(y).exec(e.nodeValue))&&(f.express(e,n,t,c[0]),e.nodeValue=C(c[1],n))}function h(e){if(e)return new RegExp(w).test(e.clas.nodeValue)}var f={attrEach:function(e,n,t,o){void 0!=I.$cache&&(t.resolver="each",t.content=o,t.scope=n,t.node=e,R(t,r,I.$cache))},each:function(e,n,t,o){void 0!=I.$cache&&(t.resolver="each",t.content=o,t.scope=n,t.node=e,R(t,r,I.$cache))},when:function(e,n,t){var o=t.clas.nodeValue,c=new RegExp(m).exec(o);if(c){var r=c.pop();t.resolver="when",t.scope=n,t.node=e,b(r,n,t)}},express:function(e,n,t,o){t.resolver="express",t.scope=n,t.node=e,b(o,n,t)},attrExpress:function(e,n,t){t.clas.nodeValue.replace(N,function(o){t.resolver="express",t.scope=n,t.node=e,"model"!=t.clas.name&&b(o,n,t)}),"value"!=t.clas.name&&"model"!=t.clas.name||function(e,n){var t=e.ownerElement;t._express=e.nodeValue.replace(y,"$1");var o="scope".concat(S(t._express));(_[t.type]||_[t.localName]||_.other)(e,n,o)}(e,n)}};function b(e,n,t){e.replace(x,function(e){C(e,n),void 0!=I.$cache&&R(t,r,I.$cache)})}var _={checkbox:function(e,n,t){try{var o=e.ownerElement;o.on("change",function(){var e=o.value.replace(/(\'|\")/g,"\\$1"),c="".concat(t,".").concat(o.checked?"ones":"remove","('").concat(e,"');");new Function("scope",c)(n)}),C(o._express,n).has(o.value)&&(o.checked=!0)}catch(e){console.log(e)}},radio:function(n,t,o){try{var c=n.ownerElement;c.on("change",function(){var e=c.value.replace(/(\'|\")/g,"\\$1"),n="".concat(o,"='").concat(e,"';");new Function("scope",n)(t)}),C(c._express,t)==c.value&&(c.checked=!0),c.name=I.$path}catch(n){console.log(e)}},select:function(n,t,o){try{var c,r=n.ownerElement;r.on("change",c=function(){var e=r.value.replace(/(\'|\")/g,"\\$1"),n="".concat(o,"='").concat(e,"';");new Function("scope",n)(t)});var i=C(r._express,t);d(i)?c():r.value=i}catch(n){console.log(e)}},other:function(n,t,o){try{var c=n.ownerElement;c.on("change",function(){var e=c.value.replace(/(\'|\")/g,"\\$1"),n="".concat(o,"='").concat(e,"';");new Function("scope",n)(t)})}catch(n){console.log(e)}}};function V(e,n){return{node:e,clas:n.clas,children:n.children,scope:n.scope,childNodes:[]}}function O(e,n,t){var o=document.createComment("each:"+I.$path);return n.appendChild(o),{node:e,clas:t.clas,children:t.children,scope:t.scope,childNodes:[{node:o,clas:t.clas,children:[],scope:t.scope,childNodes:[]}]}}!function e(n,t,o,c){i(o,function(o,r){if(1==o.clas.nodeType)if(o.clas.hasAttribute("each")){var a=(x=o.clas.getAttribute("each").split(":")).shift().trim(),d=x.pop().trim(),w=x.shift(),y=C(d,t),N=O(null,n,o);c.childNodes.push(N),f.attrEach(null,t,N,c,y),s(y,function(r,i){var s=Object.create(t||{});F(s,a,I.$path),w&&(s[w.trim()]=i.toString());var h=o.clas.cloneNode();h.removeAttribute("each"),n.appendChild(h);var d=V(h,o);N.childNodes.push(d),e(h,s,l(o.children),d),u(h,s,d,c)})}else if(/(CODE|SCRIPT)/.test(o.clas.nodeName)){var $=o.clas.cloneNode(!0);n.appendChild($);var b=V($,o);c.childNodes.push(b)}else $=o.clas.cloneNode(),n.appendChild($),b=V($,o),c.childNodes.push(b),e($,t,l(o.children),b),u($,t,b,c);else if(v.test(o.clas.nodeValue)){var x;a=(x=o.clas.nodeValue.replace(v,"$2").split(":")).shift().trim(),d=x.pop().trim(),w=x.shift(),y=C(d,t),N=O(null,n,o),c.childNodes.push(N),f.each(null,t,N,c,y);var E=l(o.children);s(y,function(c,r){var i=Object.create(t||{});F(i,a,I.$path),w&&(i[w.trim()]=r.toString());var s=V(null,o);N.childNodes.push(s),e(n,i,l(E),s)})}else{if(m.test(o.clas.nodeValue)){var _=C(o.clas.nodeValue.replace(m,"$2"),t);return(N=function(e,n,t,o,c){if(new RegExp(g).test(t.clas.nodeValue)){var r=document.createComment("when:"+I.$path);n.appendChild(r),o.childNodes.push(o={node:e,clas:t.clas,children:[],scope:t.scope,content:o,childNodes:[{node:r,clas:t.clas,children:[],scope:t.scope,childNodes:[]}]}),f.when(null,c,o)}return o}(null,n,o,c,t)).children.push(r.shift()),_?(f.when(null,t,N,c),i(r,function(e,n){if(!h(e))return!0;N.children.push(n.shift())}),i(l(o.children),function(o,c){if(1==o.clas.nodeType||p.test(o.clas.nodeValue))e(n,t,c,N);else{var r=o.clas.cloneNode();n.appendChild(r);var i=V(r,o);N.childNodes.push(i),u(r,t,i,N)}c.shift()})):void 0==_?(f.when(null,t,N,c),i(l(o.children),function(o,c){if(1==o.clas.nodeType||p.test(o.clas.nodeValue))e(n,t,c,N);else{var r=o.clas.cloneNode();n.appendChild(r);var i=V(r,o);N.childNodes.push(i),u(r,t,i,N)}c.shift()})):h(r[0])&&e(n,t,r,N),h(o)}$=o.clas.cloneNode(),n.appendChild($),b=V($,o),c.childNodes.push(b),u($,t,b,c)}r.shift()})}(n,t,o,c)}var M={view:function(e,n,t,o,c){try{var r=document.createDocumentFragment();new T(r,t,l(n.children),o,c),o.children=n.children,o.clas=n.clas,e.reappend(r)}catch(e){console.log(e)}},component:function(e,n){try{var t=O(e.clas.nodeValue,e.scope,n),o=I.$cache;if(d(t))return;u(t.model,e.scope);var c=q(e.childNodes),r=e.content.childNodes;L(e.childNodes);var i=new H({view:t.component,model:t.model,action:t.action,flux:t.flux}),a=function(e,n,t){var o=document.createComment("component:"+n.path);return e.before(o),t.content.node=t.view,{clas:n.clas,children:[t.node],scope:n.scope,resolver:n.resolver,content:n.content,childNodes:[{node:o,children:[],scope:n.scope,childNodes:[]},t.content]}}(c,e,i);R(a,n,o),r.replace(e,a),c.parentNode&&c.parentNode.replaceChild(i.view,c)}catch(e){console.log(e)}},when:function(e,n){try{var t=q(e.childNodes),o=document.createDocumentFragment(),c=e.content.childNodes;L(e.childNodes),new T(o,e.scope,l(e.children),e.content,n),c.replace(e,c.pop()),t.parentNode&&t.parentNode.replaceChild(o,t)}catch(e){console.log(e)}},each:function(e,n){try{var t=q(e.childNodes),o=document.createDocumentFragment(),c=e.content.childNodes;L(e.childNodes),new T(o,e.scope,[e],e.content,n),c.replace(e,c.pop()),t.parentNode&&t.parentNode.replaceChild(o,t)}catch(e){console.log(e)}},arrayEach:function(e,n,t,o){try{var c=function e(n,t){try{return a(n,function(n){if(n.node&&n.node.parentNode)return t=n.node;if(n.childNodes.length){var o=n.childNodes[n.childNodes.length-1];if(o.node&&o.node.parentNode)return t=o.node;t=e([o])}}),t}catch(e){console.log(e)}}([e.childNodes[t]]),r=document.createDocumentFragment(),i={clas:e.clas,children:e.children,scope:e.scope},s={childNodes:[],children:[]};new T(r,e.scope,[i],s,n),r.removeChild(r.childNodes[0]);var u=l(s.childNodes[0].childNodes);u.splice(0,1,t+1,0),e.childNodes.splices(u),o.remove(s.childNodes[0]),c.parentNode&&c.after(r)}catch(e){console.log(e)}},express:function(e,n,t){try{e.node.nodeValue=j(e.clas.nodeValue,e.scope),R(e,n,t),"value"==e.node.name&&(e.node.ownerElement.value=e.node.nodeValue)}catch(e){console.log(e)}},attribute:function(e,n,t){try{var o=document.createAttribute(j(e.clas.name,scope));R(e,n,t),o.nodeValue=e.clas.nodeValue,e.node.ownerElement.setAttributeNode(o),e.node.ownerElement.removeAttributeNode(e.node)}catch(e){console.log(e)}}},P=function(e,n,t){e.forEach(function(o,c){o.forEach(function(r){try{A[r.resolver]?A[r.resolver](r,n,t,c,o):M[r.resolver](r,c,e)}catch(e){console.error(e)}})})},A={each:function(e,n,t,o,c){try{var r=n.length;if(t>0)L(e.childNodes.splice(r+1)),M.arrayEach(e,o,e.childNodes.length-1,c);else L(e.childNodes.splice(r+1))}catch(e){console.error(e)}}};function R(e,n,t){if(t){var o=t.get(n);o?o.ones(e):t.set(n,[e])}}function q(e,n){try{return a(e,function(e){if(e.node&&e.node.parentNode)return n=e.node,e.node=null,n;n=q(e.childNodes)}),n}catch(e){console.log(e)}}function L(e){e.forEach(function(e){if(e.node&&e.node.parentNode)return e.node.parentNode.removeChild(e.node);e.childNodes&&L(e.childNodes)})}function D(e){try{return document.querySelectorAll(e)}catch(t){var n=document.createElement("div");return n.innerHTML=e.trim(),n.childNodes}}function B(e,n,t){this.addEventListener?this.addEventListener(e,function(e){n.forEach(function(n,o){n.forEach(function(n){var c=n?C("[".concat(n,"]"),t):[];c.push(e),o.apply(u({$flux:o.$flux,$view:o.$view,$action:o.$action},o.$model),c)})})},!1):this.attachEvent?this.attachEvent("on"+e,function(e){n.forEach(function(n,o){n.forEach(function(n){var c=n?C("[".concat(n,"]"),t):[];c.push(e),o.apply(u({$flux:o.$flux,$view:o.$view,$action:o.$action},o.$model),c)})})}):element["on"+e]=function(e){n.forEach(function(n,o){n.forEach(function(n){var c=n?C("[".concat(n,"]"),t):[];c.push(e),o.apply(u({$flux:o.$flux,$view:o.$view,$action:o.$action},o.$model),c)})})}}h(Node,{on:function(e,n,t,o){if(this._manager)if(this._manager.get(e)){var c=this._manager.get(e);c.get(n)?c.get(n).ones(o):c.set(n,[o])}else{var r=new Map;r.set(n,[o]),this._manager.set(e,r),B.call(this,e,r,t)}else{var i=new Map;i.set(n,[o]),this._manager=new Map,this._manager.set(e,i),B.call(this,e,i,t)}return this},off:function(e,n){if(this._manager){var t=this._manager.get(e);if(void 0==t)return;if(t.delete(n),t.size)return;this._manager.delete(e),function(e,n){this.addEventListener?this.removeEventListener(e,n,!1):this.detachEvent?this.detachEvent("on"+e,n):element["on"+e]=null}.call(this,e,n)}return this},reappend:function(e){return a(l(this.childNodes),function(e){e.parentNode.removeChild(e)}),this.appendChild(e),this},before:function(e){this.parentNode.insertBefore(e,this)},after:function(e){this.nextSibling?this.parentNode.insertBefore(e,this.nextSibling):this.parentNode.appendChild(e)}}),h(NodeList,{on:function(e,n){return a(this,function(t){t.on(e,n)}),this},off:function(e,n){return a(this,function(t){t.off(e,n)}),this}});var I={$path:void 0},H=function(){function e(n){o(this,e),this.content={childNodes:[],children:[]},this.flux=n.flux,this.model=n.model,this.action=n.action,_(n.model,function(e,n){z(e,n)},function(e){I.$path=e}),_(n.flux,function(e,n){z(e,n)},function(e){I.$path=e}),n.view?this.view(n):this.component(n)}return r(e,[{key:"view",value:function(e){var n,t,o=D(e.view),c=function e(n,t){var o=t||[];return i(n,function(t){if(n.shift(),new RegExp(b).test(t.nodeValue))return!0;var c={clas:t.cloneNode(!0),children:[]};3==t.nodeType&&""==t.nodeValue.trim()||o.push(c),1==t.nodeType?e(l(t.childNodes),c.children):new RegExp(p).test(t.nodeValue)&&e(n,c.children)}),o}(function e(n){return a(n,function(n){n.childNodes[0]&&!/(CODE|SCRIPT)/.test(n.nodeName)&&e(l(n.childNodes)),3==n.nodeType&&n.nodeValue.replace(f,function(e){var t=n.nodeValue.split(e);n.parentNode.insertBefore(document.createTextNode(t[0]),n),n.parentNode.insertBefore(document.createTextNode(e.trim()),n),n.nodeValue=n.nodeValue.replace(t[0],"").replace(e,"")})}),n}(l(o)))[0];this.node=c,this.view=o[0],this.flux=e.flux,this.components=e.components,n=e.action,t={$flux:e.flux,$view:this.view,$model:e.model,$action:e.action},n&&Object.values(n).forEach(function(e){var n=Object.assign({},t);n.__proto__=Function.__proto__,e.__proto__=n}),M.view(this.view,c,e.model,this.content,this)}},{key:"component",value:function(e){var n=D(e.component);this.view=n[0],this.view.parentNode.removeChild(this.view),this.component=this.view.outerHTML}}]),e}();function z(e,n){e.forEach(function(e,t){l(e).forEach(function(o){!function e(n,t){try{return n.every(function(n){if(n.node){var o=n.node.ownerElement||n.node;return t=document.body.contains(o),!1}t=e(n.childNodes)}),t}catch(e){console.log(e)}}([o])?e.remove(o):M[o.resolver](o,t,n)})})}return window.View=H,window.Router=function(e,n){var t,o,c,r=/^:/,i=/^\/(.+)/;this.redreact=h;var a,s=!((a=window.navigator.userAgent).indexOf("compatible")>-1&&a.indexOf("MSIE")>-1||a.indexOf("Trident")>-1||a.indexOf("Edge")>-1)&&window.history&&"pushState"in window.history;function l(e){for(c=Object.keys(n);c.length;){t=c.shift(),o={};var r=t.replace(i,"$1");if(u(r=r.split("/"),e.split("/")))return{component:n[t].component,router:n[t].router,action:n[t].action,after:n[t].after,params:o,path:e}}}function u(e,n){for(;n.length;){var t=e.shift(),c=n.shift();if(c!=t){if(!r.test(t))return!1;t=t.replace(r,""),o[t]=c}}return!0}function h(e){var n=window.location.pathname;window.location.href=n+"#"+e}function d(n){var t=l(window.location.hash.replace(/^#\/?/,""));t?(t.action(t.params),e.flux[t.router]=t.component,t.after&&t.after()):void 0!=n&&"load"!=n.type||h("")}window.addEventListener("load",d,d()),window.addEventListener(s?"popstate":"hashchange",d,!1)},window.query=D,n.View=H,n.global=I,n}({});
