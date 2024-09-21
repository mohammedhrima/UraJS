// Initially change the URL to /user without reloading the page
history.pushState({}, "User Page", "#/user");
// Listen to popstate events (for back/forward navigation)
window.addEventListener("popstate", (event) => {
    alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
});
// On page load, if the current URL is /user, revert the URL to `/`
// This makes the server think you're on `/` but you can programmatically handle the user interface.
window.addEventListener("load", () => {
    if (window.location.pathname === "/user") {
        // Change the URL to root `/`
        history.replaceState({}, "", "/");
        // After some delay or right after, change it back to `/user`
        setTimeout(() => {
            history.pushState({}, "User Page", "/user");
        }, 10); // Add a slight delay to ensure the browser processes the state change.
    }
});
function navigate(path) {
    history.pushState({}, "", "#" + path);
}
navigate("/home");
navigate("/home/user");
// window.addEventListener("DOMContentLoaded", () => {
//   console.log("dom update");
// });
// window.addEventListener("beforeunload", (e) => {
//   e.preventDefault()
//   console.log("beforeunload");
// });
// window.addEventListener("unload", (e) => {
//   e.preventDefault()
//   console.log("unload");
// });
