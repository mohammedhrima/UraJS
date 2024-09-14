const routes = {
  404: {
    render: (params) => {
      return `<h1>Page not found ${params ? params : ''}</h1>`;
    },
  },
  "/": {
    render: (params) => {
      return `<h1>This is the home page ${params ? params.id : ''}</h1>`;
    },
  },
  "/about": {
    render: (params) => {
      return `<h1>This is the about page ${params ? params.id : ''}</h1>`;
    },
  },
  "/contact": {
    render: (params) => {
      return `<h1>This is the contact page ${params ? params : ''}</h1>`;
    },
  },
  "/contact/route": {
    render: (params) => {
      return `<h1>This is the contact/route page ${params ? params : ''}</h1>`;
    },
  },
};

function display(template) {
  document.getElementById("content").innerHTML = template;
}

// Function to handle location changes and update content
const locationHandler = () => {
  // Get the hash part of the URL and remove the leading '#'
  const hash = window.location.hash.slice(1) || "/";
  console.log("hash:", hash);

  // Extract parameters from hash if any
  const [route, queryString] = hash.split("?");
  const params = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};

  // Check if the route exists in routes, otherwise use 404
  const routeConfig = routes[route] || routes["404"];

  display(routeConfig.render(params));
};

// Function to navigate to a route
const navigate = (route, params = {}) => {
  // Create a query string from params
  const queryString = new URLSearchParams(params).toString();
  const fullRoute = queryString ? `${route}?${queryString}` : route;

  // Update the URL without reloading the page
  window.history.pushState({}, "", `#${fullRoute}`);
  locationHandler();
};

// Function to handle link clicks
// const route = (event) => {
//   event = event || window.event;
//   event.preventDefault();

//   // Get the href attribute from the clicked link
//   const href = event.target.getAttribute("href");
//   console.log("href:", href);

//   // Navigate to the route
//   navigate(href.slice(1)); // Remove leading '#' from href
// };

// // Event listener for navigation links
// document.addEventListener("click", (e) => {
//   const { target } = e;
//   if (!target.matches("nav a")) {
//     return;
//   }
//   e.preventDefault();
//   route(e);
// });

// Handle hash changes and initial load
window.addEventListener("hashchange", locationHandler);
window.addEventListener("DOMContentLoaded", locationHandler);

// Get references to input and button elements
let input = document.getElementById("input");
let btn = document.getElementById("btn");

// Event handler for button click
btn.onclick = () => {
  const route = input.value || "/";
  console.log("Navigating to:", route);
  navigate(route, {id:10}); // Call navigate with the route from input
};
