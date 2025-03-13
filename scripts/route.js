#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname, basename } from "path";
import { config, parse_config_file, source } from "./utils.js";
import "../ura.config.js";

if (process.argv.length < 3) {
  console.error("Usage: uraroute <route1> <route2> ...");
  process.exit(1);
}

const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

const ensureDirectoryExists = (filePath) => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

const createFile = (filePath, content) => {
  ensureDirectoryExists(filePath);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
  } else {
    console.warn(`Skipped (already exists): ${filePath}`);
  }
};

const generateComponent = (name) => {
  const isTailwind = config.style === "tailwind";
  const isTS = ["ts", "tsx"].includes(config.ext);

  return `${isTS ? '//@ts-ignore\n' : ""}import Ura${isTS ? ", { VDOM, Props }" : ""} from 'ura';

// ${capitalize(name)} route
const [render, State] = Ura.init();
const [getter, setter] = State${isTS ? "<number>" : ""}(0);

const ${capitalize(name)} = render((props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} => {
  return (
    <root>
      <div className="${name.toLowerCase()}">
        <h1 className="${""}">
          Hello from ${capitalize(name)} route!
        </h1>
        <button className="${""}" 
          onclick={() => setter(getter() + 1)}>
          Click me [{getter()}]
        </button>
      </div>
    </root>
  );
});

export default ${capitalize(name)}
`;
};

const generateStyle = (name) => {
  const styleTemplate = `.${name} {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  background: #282c34;
  color: #ffffff;
}

.${name} h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ffffff;
}

.${name} button {
  height: 120px;
  width: 120px;
  font-size: 20px;
  font-weight: bold;
  background-color: #3178c6;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.${name} button:hover {
  background-color: #ffffff;
  color: #3178c6;
}`;

  return config.style === "scss" ? styleTemplate.replace(/(?<=\}\n)/g, "  ") : styleTemplate;
};

process.argv.slice(2).forEach((route) => {
  const name = basename(route);
  const ext = config.ext
  const styleExt = config.style;

  createFile(join(source, `./pages/${name}/`, `${name}.${ext}`), generateComponent(name));
  if (["css", "scss"].includes(styleExt)) {
    createFile(join(source, `./pages/${name}/`, `${name}.${styleExt}`), generateStyle(name));
  }
});
