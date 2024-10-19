import fs from "fs";
import path from "path";
import process from "process";
import readline from "readline";
import UTILS from "./utils";

const { GET } = UTILS;

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
                openDir(path.resolve(GET("SOURCE"), "./pages"));
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

