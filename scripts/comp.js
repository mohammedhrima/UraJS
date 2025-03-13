#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname, basename } from "path";
import { config, source } from "./utils.js";
import "../ura.config.js";

if (process.argv.length < 3) {
  console.error("Usage: uracomp <comp1> <comp2> ...");
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

// ${capitalize(name)} component
const [render, State] = Ura.init();
const [count, setCount] = State${isTS ? "<number>" : ""}(0);

const ${capitalize(name)} = render((props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} => {
  return (
      <div className="${name.toLowerCase()}">
        <h2>Counter</h2>
        <p>Current Count: {count()}</p>
        <div className="button-group">
          <button onClick={() => setCount(count() + 1)}>Increment</button>
          <button onClick={() => setCount(count() - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
      );
});

export default ${capitalize(name)}
`;
};

const generateStyle = (name) => {
  const styleTemplate = `.${name} {
  text-align: center;
  padding: 20px;
  background: var(--feature-bg);
  border-radius: 10px;
  box-shadow: 0 4px 6px var(--shadow-color);
  max-width: 300px;
  margin: 20px auto;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  h2 {
    font-size: 1.75rem;
    color: var(--primary-color);
    margin-bottom: 15px;
  }
  p {
    font-size: 1.25rem;
    color: var(--text-color);
    margin-bottom: 20px;
  }
  button {
    height: 40px;
    flex: 1;
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    background-color: var(--primary-color);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    &:hover {
      background-color: var(--button-hover-bg);
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }
  }
  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}`;

  return config.style === "scss" ? styleTemplate.replace(/(?<=\}\n)/g, "  ") : styleTemplate;
};

process.argv.slice(2).forEach((route) => {
  const name = basename(route);
  const ext = config.ext
  const styleExt = config.style;

  createFile(join(source, `./components/`, `${name}.${ext}`), generateComponent(name));
  if (["css", "scss"].includes(styleExt)) {
    createFile(join(source, `./components/`, `${name}.${styleExt}`), generateStyle(name));
  }
});
