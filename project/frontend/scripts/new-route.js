import fs from "fs";
import path from "path";
import UTILS from "./utils.js";
const { GET, UPDATE_ROUTES } = UTILS;

let routeName = process.argv[2];

if (!routeName) {
  console.error("Error: Please provide a route name as an argument.");
  process.exit(1);
}

const folderPath = path.join(GET("SOURCE") + "/pages", routeName);
const jsxFilePath = path.join(
  folderPath,
  `${path.basename(routeName)}.${GET("EXTENSION")}`
);

if (fs.existsSync(folderPath)) {
  console.error(`Error: Folder "${folderPath}" already exists.`);
  process.exit(1);
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

try {
  fs.mkdirSync(folderPath, { recursive: true });

  const jsxContent = `import Ura from 'ura';

function ${capitalize(path.basename(routeName))}() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="${path.basename(routeName).toLowerCase()}">
      <h1>Hello from ${capitalize(path.basename(routeName))} component!</h1>
      <button onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}
  
export default ${capitalize(path.basename(routeName))}
`;
  fs.writeFileSync(jsxFilePath, jsxContent);
  if (GET("STYLE_EXTENTION")) {
    // Write a basic CSS file
    const cssFilePath = path.join(
      folderPath,
      `${path.basename(routeName)}.${GET("STYLE_EXTENTION")}`
    );
    const cssContent = `.${path.basename(routeName).toLowerCase()}\n{\n}`;
    fs.writeFileSync(cssFilePath, cssContent);
  }

  console.log(`Component "${routeName}" created successfully`);
  UPDATE_ROUTES();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
