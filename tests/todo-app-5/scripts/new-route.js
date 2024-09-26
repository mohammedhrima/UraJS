import fs from "fs";
import path from "path";
import process from "process";
import { SRCDIR, GET_CONFIG } from "./utils.js";
import updateRoutes from "./update-routes.js";
import readline from "readline";

const UP = "up";
const DOWN = "down";
const RIGHT = "right";
const LEFT = "left";
const ENTER = "return";

// setup readline
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let items = ["util", "route"];
let pos = 0;
let option = "";

let dirs = [];
let curr_dir = null;
let dir_pos = -1;

function display_items() {
  console.clear();
  if (option) {
    console.log("+ Use arrow keys (UP/DOWN) to choose dir");
    console.log("+ Use arrow keys (LEFT/RIGHT) to enter or leave directory");
    console.log(`+ Hit Enter to generate the ${option == "route" ? "Route" : "Util"}`);
    console.log("+ CTRL+C to exit\n\n");
    console.log(`Current Directory: ${curr_dir.name}`);
  } else {
    console.log("+ Use arrow keys (UP/DOWN) to choose option, then hit Enter");
    console.log("+ CTRL+C to exit\n\n");
  }
  items.forEach((item, index) => {
    console.log(index === pos ? `> ${item}` : ` ${item}`);
  });
}

function openDir(pathname) {
  dir_pos++;
  dirs.push({ name: pathname, cursor: 0 });
  curr_dir = dirs[dir_pos];

  items = fs.readdirSync(curr_dir.name).filter((item) => {
    return fs.statSync(path.join(curr_dir.name, item)).isDirectory() && item !== "_utils";
  });
  items.unshift(".");
  pos = 0;
}

function exitDir() {
  dir_pos--;
  curr_dir = dirs[dir_pos];

  items = fs.readdirSync(curr_dir.name).filter((item) => {
    return fs.statSync(path.join(curr_dir.name, item)).isDirectory() && item !== "_utils";
  });
  items.unshift(".");
  pos = curr_dir.cursor;
}

let choosing = true;
function handleKeypress(_, key) {
  switch (key.name) {
    case UP:
      pos = pos === 0 ? items.length - 1 : pos - 1;
      break;
    case DOWN:
      pos = pos === items.length - 1 ? 0 : pos + 1;
      break;
    case LEFT:
      if (option && dir_pos > 0) exitDir();
      break;
    case RIGHT:
      if (option && items[pos] !== ".") openDir(path.join(curr_dir.name, items[pos]));
      break;
    case ENTER:
      if (!option) {
        // choosing = false;
        option = items[pos];
        console.log(`You chose: ${option}`);
        openDir(path.resolve(SRCDIR, "./pages"));
        display_items();
      } else {
        choosing = false;
        console.log(`You chose ${items[pos]} directory`);
        rl.question(`Enter the ${option}(s) name: `, (answer) => {
          console.log(`your answer ${answer}`);
          createRoutes(path.join(curr_dir.name, items[pos]), answer);
        });
      }
      return;
    default:
      break;
  }
  if (choosing) display_items();
}

display_items();
process.stdin.on("keypress", handleKeypress);

function createRoutes(dist, foldersName) {
  const folders = foldersName.split(" ");
  folders.forEach((name) => {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let dir = "";
    let filePath = "";
    let Content = "";
    let CssPath = "";
    let CssContent = "";
    let miniPath = "";
    let typesPath = "";
    // option == "route" ? path.join(dist, name) : path.join(dist, `./_utils/${name}`);
    try {
      if (option == "route") {
        dir = path.join(dist, name);
        miniPath = path.relative(dir, path.resolve(SRCDIR, "./Ura/code.js"));
        typesPath = path.relative(dir, path.resolve(SRCDIR, "./mini/types.js"));
        filePath = path.join(
          dir,
          `./${name}${GET_CONFIG().EXTENTION == "ts" ? ".tsx" : ".jsx"}`
        );
        Content = `// ${path.relative(SRCDIR, filePath)}
import Ura from "${miniPath}";
${GET_CONFIG().EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Ura.loadCSS("./${name}.css");
    
function ${name}()${GET_CONFIG().EXTENTION == "ts" ? ": MiniComponent" : ""} {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state${GET_CONFIG().EXTENTION == "ts" ? `<number>` : ""}(0);
    
  const handleClique = () => setter(getter() + 1);    
  return render(() => (
      <root>
        <div id="${name}">${name} counter {getter()}</div>
        <br />
        <button onclick={handleClique}>clique me</button>
      </root>
    ));
  }
export default ${name};  
`;
        CssPath = path.join(dir, `./${name}.css`);
        CssContent = `/* Add your styles here */\n#${name}\n{\n}\n`;
      } else {
        dir = path.join(dist, `./_utils/${name}`);
        miniPath = path.relative(dir, path.resolve(SRCDIR, "./Ura/code.js"));
        typesPath = path.relative(dir, path.resolve(SRCDIR, "./mini/types.js"));
        filePath = path.join(
          dir,
          `./${name}${GET_CONFIG().EXTENTION == "ts" ? ".tsx" : ".jsx"}`
        );
        Content = `// ${path.relative(SRCDIR, filePath)}
import Ura from "${miniPath}";
${GET_CONFIG().EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Ura.loadCSS("./${name}.css");
    
function ${name}()${GET_CONFIG().EXTENTION == "ts" ? ": MiniComponent" : ""} {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state${GET_CONFIG().EXTENTION == "ts" ? `<number>` : ""}(0);
    
  const handleClique = () => setter(getter() + 1);    
  return render(() => (
      <>
        <div className="${name}">${name} counter {getter()}</div>
        <br />
        <button onclick={handleClique}>clique me</button>
      </>
    ));
  }
export default ${name};  
`;
        CssPath = path.join(dir, `./${name}.css`);
        CssContent = `/* Add your styles here */\n.${name}\n{\n}\n`;
      }
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, Content, "utf8");
      fs.writeFileSync(CssPath, CssContent, "utf8");
      console.log(`Route created: ${dir}`);
      updateRoutes();
    } catch (error) {
      console.error(`Error creating route: ${error.message}`);
    }
  });
  process.exit(0);
}
