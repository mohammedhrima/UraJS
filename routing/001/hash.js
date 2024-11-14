const urlRoutes = {
  "": {
    template: "this is /",
  },
  "test1": {
    template: "this is test1",
  },
  "test2": {
    template: "this is test2",
  },
  "test3": {
    template: "this is test3",
  },
};

const locationHandler = async () => {
	var location = window.location.hash.replace("#", "");
	if (location.length == 0) {
		location = "";
	}
  
  window.history.pushState("object or string", "Title", location);
  // window.location.pathname = location
  console.log(location);
	const route = urlRoutes[location] || urlRoutes["404"];
	document.getElementById("content").innerHTML = route.template;
};

window.addEventListener("hashchange", locationHandler);
locationHandler();