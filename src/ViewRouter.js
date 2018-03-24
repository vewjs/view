export function Router(app, params) {
  var $param = /^:/;
  let router, para, routes;
  this.redreact = redreact;

  function resolver(hash) {
    routes = Object.keys(params);
    while (routes.length) {
      router = routes.shift(), para = {};
      let routs = router.split("/");
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
        name = name.replace($param, "")
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
    var hash = window.location.hash.replace("#", "");
    let router = resolver(hash);
    if (router) {
      router.action(router.params);
      app.model[router.router] = router.component;
      if (router.after) {
        router.after();
      }
    }
  }

  window.addEventListener("load", action, false);
  window.addEventListener("onpopstate" in window ? "popstate" : "hashchange", action, false);

}