const urlRoutes = {
  "/": {
    template: "this is /",
  },
  "/test1": {
    template: "this is test1",
  },
  "/test2": {
    template: "this is test2",
  },
  "/test3": {
    template: "this is test3",
  },
};

const pathToRegex = (path) => {
  return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
};

const getParams = (match) => {
  console.log(match);
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};


const router = async (path) => {
  let location = path || "/";
  console.log(location);
  if (location.length == 0) {
    location = "/";
  }
  const route = urlRoutes[location] || urlRoutes["/"];
  document.getElementById("content").innerHTML = route.template;
};

const urlRoute = (event) => {
  event = event || window.event; // get window.event if event argument not provided
  event?.preventDefault();
  // window.history.pushState(state, unused, target link);
  window.history.pushState({}, "", event.target.href);
  router(event?.target.href);
};

document.addEventListener("click", (e) => {
  const { target } = e;
  if (!target.matches("nav a")) {
    return;
  }
  console.log("cliqe on nav");
  e.preventDefault();
  urlRoute();
});


document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOMContentLoaded");
  if (event) urlRoute(event);
});


window.addEventListener("load", (event) => {
  console.log("load");
  if (event) urlRoute(event);
});

// window.addEventListener("beforeunload", urlRoute);
window.onpopstate = urlRoute;
window.route = urlRoute;
urlRoute();


