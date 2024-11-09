const Routes = [
    {
        "path": "/home",
        "from": "./home/home.js",
        "css": "./home/home.css"
    },
    {
        "path": "/login",
        "from": "./login/login.js",
        "base": true,
        "css": "./login/login.css"
    },
    {
        "path": "/user",
        "from": "./user/user.js",
        "css": "./user/user.css"
    }
];
export default Routes;
