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
            "user": {
                "call": "User",
                "dir": "Home/User",
                "filename": "User.js"
            },
            "user1": {
                "call": "User1",
                "dir": "Home/User1",
                "filename": "User1.js"
            },
            "user2": {
                "call": "User2",
                "dir": "Home/User2",
                "filename": "User2.js"
            }
        },
        "default": true
    },
    "test": {
        "call": "Test",
        "dir": "Test",
        "filename": "Test.js",
        "subpaths": {
            "user": {
                "call": "User",
                "dir": "Test/User",
                "filename": "User.js",
                "subpaths": {
                    "mhrima": {
                        "call": "Mhrima",
                        "dir": "Test/User/Mhrima",
                        "filename": "Mhrima.js"
                    }
                }
            }
        }
    },
    "user": {
        "call": "User",
        "dir": "User",
        "filename": "User.js"
    }
};
export default Routes;
