
const urlRoutes = {
  "/": {
    template: "this is /",
  },
  "/about": {
    template: "this is about",
  },
  "/contact": {
    template: "this is contact",
  },
};

const urlLocationHandler = async () => {
  const location = window.location.pathname;
  console.log(location);
  if (location.length == 0) {
    location = "/";
  }
  const route = urlRoutes[location] || urlRoutes["/"];
  document.getElementById("content").innerHTML = route.template;
};

const urlRoute = (event) => {
  event = event || window.event; // get window.event if event argument not provided
  event.preventDefault();
  // window.history.pushState(state, unused, target link);
  window.history.pushState({}, "", event.target.href);
  urlLocationHandler();
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

window.onpopstate = urlLocationHandler;
// call the urlLocationHandler function to handle the initial url
window.route = urlRoute;
urlLocationHandler();