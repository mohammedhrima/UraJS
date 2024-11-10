import Ura from "ura";
Ura.loadCSS("./pages/main.css")

const Routes = [
    {
        "path": "/home",
        "from": "./home/home.js",
        "style": "./home/home.css",
        "base": true
    },
    {
        "path": "/login",
        "from": "./login/login.js",
        "style": "./login/login.css"
    },
    {
        "path": "/user",
        "from": "./user/user.js",
        "style": "./user/user.css"
    }
];

export default Routes;
