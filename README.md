<p align="center">
  <img src="./src/assets/logo.png" alt="Logo" width="200">
</p>

# UraJS

**UraJS** is a lightweight, modern single-page application (SPA) framework designed to make building interactive and dynamic web applications intuitive and efficient. It combines the power of **JSX**, **virtual DOM reconciliation**, and a **custom state management system** to provide a seamless development experience without the bloat.

Inspired by the simplicity of **React**, the directory-based routing of **Next.js**, and the flexibility of **Vue**, UraJS introduces its own take on SPA development. Its directory-based routing system automatically generates routes from the file structure, streamlining navigation setup for developers.

With built-in support for **live reloading**, **state-driven UI updates**, and a focus on performance, UraJS empowers developers to create fast, maintainable, and user-friendly applications.

## Get Started

To get started with **UraJS**, follow these simple steps:
1. **Clone the repository**:
```bash
   git clone https://github.com/mohammedhrima/UraJS
```
2. **Navigate to the project directory**:
```bash
   cd UraJS
```
3. **Install the dependencies**:
```bash
   npm install
```
4. **Start the development server**:
```bash
   npm start
```
5. **Open your browser** and visit http://localhost:17000 to see the app running.
6. **folders structure**:

    ```
        UraJS/
        ├── out/                   # Contains the transpiled pure vanilla JavaScript files.
        │   └── (Transpiled files) # Automatically generated files after compilation from TypeScript/JSX to vanilla JS.
        ├── scripts/               # Contains all the scripts used in developement
        ├── src/                   # Main source code for your app and framework.
        │   ├── assets/            # Recommended folder to store static files like images.
        │   │   └── (Image files)  # Place image assets here for easy management.
        │   ├── pages/             # Contains all your route files (e.g., home, about, etc.).
        │   │   ├── home/          # Default route (example: /home).
        │   │   │   ├── home.jsx   # Home route component.
        │   │   │   └── home.scss  # Styling for the home route.
        │   │   └── (Other pages)  # Other route components, following the same structure.
        │   └── ura/               # Framework source code.
        ├── config.json            # Configuration file for framework settings (e.g., default route, port, styling options).
        ├── tsconfig.json          # TypeScript configuration file for compiling the code.
        ├── index.html             # The main HTML file where the app is loaded.
        └── package.json           # Project metadata, dependencies, and scripts (e.g., npm start).
    
    ```
## Usage

Once the development server is running, you can begin creating your app. **UraJS** uses a file-based routing system, meaning that the structure of your project’s files will directly map to your routes. Simply add a new file in the `pages` directory to create a new route.

For example:
- `pages/about/about.jsx` maps to the `/about` route.
- `pages/home/home.jsx` maps to the `/home` route.

### Generating Routes
To generate routes automatically, you can use the following commands:
- To generate a **basic route and its SCSS file**, run:
    
    ```bash
      npm run gen /routename
    ```

+ This will create 
pages/routename/nestedroute.jsx mapped to the /routename/nestedroute route.
pages/routename/nestedroute.scss for styling the nested route.
After generating the route and its styles, visit the route in the browser by navigating to the corresponding URL, e.g., http://localhost:17000/routename or http://localhost:17000/routename/nestedroute.

+ Make sure the file structure matches the route you want to create, as UraJS automatically generates routes based on the folder hierarchy within the pages directory. Each route will have a matching SCSS file that is automatically linked to the JSX component.

+ src/global.scss file is used for global variables for a fast user experience

+ By default, UraJS will compile SCSS into CSS for the styling of your routes. However, if you prefer to use plain CSS, you can configure it in the config.json file.

### Configuration in config.json
The config.json file allows you to customize various settings for your project, including file extensions, server configurations, and routing preferences. Here is an example configuration:

```json
    {
      "DEFAULT_ROUTE": "/home",
      "EXTENSION": "jsx",
      "STYLE_EXTENSION": "scss",
      "PORT": 17000,
      "SERVER_TIMING": 15,
      "DIR_ROUTING": true,
      "TYPE": "dev"
    }
```

+ Configuration Options:
    + DEFAULT_ROUTE: Specifies the default route for your app (e.g., /home).
    + EXTENSION: Defines the file extension for your components. You can set it to js, jsx, ts, or tsx.
    + STYLE_EXTENSION: Defines the file extension for stylesheets. You can set it to scss (default) or css.
    + PORT: Defines the port for the development server (default: 17000).
    + SERVER_TIMING: Defines the timing to compile and serve files. Adjust this if you want to customize how often files are recompiled.
    + DIR_ROUTING: If set to true, UraJS will use the default directory-based routing system. Set it to false if you prefer to use your own routing system.
    + TYPE: Don't touch it


### Using Custom Routing (optional)
+ To use custom routing with UraJS, users can create and manage their routes manually by using the route.json file. Here's how they can do it:

+ By default, UraJS uses a file-based routing system, but if you prefer to handle routes manually, you can disable the default directory routing by setting "DIR_ROUTING": false in the config.json file. This will allow you to manage your routes independently using the route.json file.

+ After disabling directory routing, you can define routes and styles in route.json as follows:

/src/route.json:
```
    {
      "routes": {
        "/home": "/pages/home/home.js",
        "/home/user": "/pages/home/user/user.js"
      },
      "styles": [
        "/pages/global.css",
        "/pages/home/home.css",
        "/pages/home/user/user.css",
        "/pages/main.css"
      ],
      "base": "/home",
      "type": "dev"
    }
```
+ How to Use route.json:
1. **Disabling Directory Routing:**
    - In config.json, set "DIR_ROUTING": false to disable automatic file-based routing.
    - This will prevent UraJS from automatically creating routes based on the file and directory structure in the pages directory.
2. **Define Routes in route.json:**
    - The routes object in route.json maps URLs to specific files. For example:
         - "/home" maps to "/pages/home/home.js".
        - "/home/user" maps to "/pages/home/user/user.js".
    - You can define any custom URL paths and their corresponding file locations in the routes object.
3. **Define Styles in route.json:**
    - The styles array allows you to specify global and route-specific CSS or SCSS files. For example:
    -  "/pages/global.css" contains global variables.
    -  "/pages/home/home.css" and "/pages/home/user/user.css" are route-specific styles linked to their respective routes.
4. **Set the Default Route:**
    - The "base" property specifies the default route that the app will load when it starts. For example, setting "base": "/home" means the /home route will be the default when the app first loads.



































































