const readline = require("readline");
const fs = require("fs");
const path = require("path");

const UP = "up";
const DOWN = "down";
const RIGHT = "right";
const LEFT = "left";
const ENTER = "return";

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

function display() {
  console.clear();
  if (option) console.log(`Current Directory: ${curr_dir.name}`);
  items.forEach((item, index) => {
    console.log(index === pos ? `> ${item}` : ` ${item}`);
  });
}

function openDir(pathname) {
  dir_pos++;
  dirs.push({ name: pathname, cursor: 0 });
  curr_dir = dirs[dir_pos];

  items = fs.readdirSync(curr_dir.name).filter((item) => {
    return (
      fs.statSync(path.join(curr_dir.name, item)).isDirectory() &&
      item !== "_utils"
    );
  });
  items.unshift(".");
  pos = 0;
}

function exitDir() {
  dir_pos--;
  curr_dir = dirs[dir_pos];

  items = fs.readdirSync(curr_dir.name).filter((item) => {
    return (
      fs.statSync(path.join(curr_dir.name, item)).isDirectory() &&
      item !== "_utils"
    );
  });
  items.unshift(".");
  pos = curr_dir.cursor;
}

function createRoutes(dist, foldersName) {
  const folders = foldersName.split(" ");
  folders.forEach((folder) => {
    const newFolderPath =
      option == "route"
        ? path.join(dist, folder)
        : path.join(dist, `./_utils/${folder}`);
    try {
      fs.mkdirSync(newFolderPath, { recursive: true });
      fs.writeFileSync(path.join(newFolderPath, `${folder}.js`), "", "utf8");
      fs.writeFileSync(path.join(newFolderPath, `${folder}.css`), "", "utf8");
      console.log(`Route created: ${newFolderPath}`);
    } catch (error) {
      console.error(`Error creating route: ${error.message}`);
    }
  });
  process.exit(0);
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
      if (option && items[pos] !== ".")
        openDir(path.join(curr_dir.name, items[pos]));
      break;
    case ENTER:
      if (!option) {
        choosing = false;
        option = items[pos];
        console.log(`You chose: ${option}`);
        openDir(path.resolve(__dirname, "./pages"));
        display();
      } else {
        choosing = false;
        rl.question("Enter the folder(s) name: ", (answer) => {
          console.log(`your answer ${answer}`);
          createRoutes(path.join(curr_dir.name, items[pos]), answer);
        });
      }
      return;
    default:
      break;
  }
  if (choosing) display();
}

display();
process.stdin.on("keypress", handleKeypress);
