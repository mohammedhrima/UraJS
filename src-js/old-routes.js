// Define routes and their corresponding content
const routes = {
    '/': '<h1>Home Page</h1><p>Welcome to the home page!</p>',
    '/about': '<h1>About Page</h1><p>Learn more about us.</p>',
    '/contact': '<h1>Contact Page</h1><p>Contact us here.</p>',
};
// Function to update the content based on the current URL
function updateContent() {
    const path = window.location.pathname;
    const content = routes[path] || '<h1>404 - Page Not Found</h1>';
    document.getElementById('root').innerHTML = content;
}
// Function to handle link clicks and navigate without reloading
function handleLinkClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    history.pushState(null, '', href);
    updateContent();
}
// Attach event listeners to navigation links
document.querySelectorAll('a[data-link]').forEach(anchor => {
    anchor.addEventListener('click', handleLinkClick);
});
// Handle the initial page load
window.addEventListener('popstate', updateContent);
window.addEventListener('load', updateContent);
