// esbuild.config.js
const esbuild = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");
const fs = require("fs");

function loadJpg(filePath) {
  const data = fs.readFileSync(filePath);
  const base64Data = Buffer.from(data).toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64Data}`;
  return dataUri;
}

function loadPng(filePath) {
  const data = fs.readFileSync(filePath);
  const base64Data = Buffer.from(data).toString("base64");
  const dataUri = `data:image/png;base64,${base64Data}`;
  return dataUri;
}

function loadSvg(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(data).toString("base64")}`;
  return dataUri;
}

// Define esbuild configuration
esbuild
  .build({
    entryPoints: ["./src/main.js"], // Update with your entry file
    bundle: true,
    outfile: "static/index.js", // Output file name
    loader: {
      ...esbuild.defaultLoaders,
      ".js": "jsx",
    },
    jsxFactory: "Mini.createElement", // Specify the custom JSX pragma
    jsxFragment: "Mini.Fragment", // Optionally specify the fragment pragma
    plugins: [
      cssModulesPlugin(),
      {
        name: "jpg-loader",
        setup(build) {
          // Handle JPG files
          build.onLoad({ filter: /\.jpg$/ }, async (args) => {
            // Use the custom loader function to load JPG files
            return {
              contents: `export default "${loadJpg(args.path)}";`,
              loader: "js",
            };
          });
        },
      },
      {
        name: "png-loader",
        setup(build) {
          // Handle JPG files
          build.onLoad({ filter: /\.png$/ }, async (args) => {
            // Use the custom loader function to load JPG files
            return {
              contents: `export default "${loadPng(args.path)}";`,
              loader: "js",
            };
          });
        },
      },
      {
        name: "svg-loader",
        setup(build) {
          // Handle SVG files
          build.onLoad({ filter: /\.svg$/ }, async (args) => {
            // Use the custom loader function to load SVG files
            return {
              contents: `export default "${loadSvg(args.path)}";`,
              loader: "js",
            };
          });
        },
      }
    ],
  })
  .catch(() => process.exit(1)); // Exit with error code if build fails
