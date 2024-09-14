const Routes = {
    "about": {
        "call": "About",
        "dir": "About",
        "filename": "About.js"
    },
    "home": {
        "call": "Home",
        "dir": "Home",
        "filename": "Home.js",
        "subpaths": {
            "data": {
                "call": "Data",
                "dir": "Home/Data",
                "filename": "Data.js"
            }
        },
        "default": true
    },
    "test": {
        "call": "Test",
        "dir": "Test",
        "filename": "Test.js"
    },
    "user": {
        "call": "User",
        "dir": "User",
        "filename": "User.js"
    }
};
export default Routes;
