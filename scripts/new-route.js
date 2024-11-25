import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { updateRoutes, source, GET } from "./utils.js";
import { logerror } from "./debug.js";

let routeName = process.argv[2];
if (!routeName) {
  logerror("Error: Please provide a route name as an argument.")
  process.exit(1);
}

const dir = join(source + "/pages", routeName);
const base = basename(routeName);
const jsFile = join(dir, `${base}.${GET("EXTENSION")}`);
const className = routeName.toLowerCase().replaceAll("/", "-");

if(existsSync(dir))
{
  logerror("Error: directory ", dir, "already exists");
  process.exit(1);
}

function capitalize(name)
{
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateComponent()
{
  const isTailwind = GET("STYLE_EXTENTION") === "tailwind";
  const isTS = ["ts", "tsx"].includes(GET("EXTENSION"));
  return `${isTS ? '//@ts-ignore\n' : ""}import Ura${isTS ? ", { VDOM, Props }" : ""} from 'ura';

function ${capitalize(base)}(props${isTS ? ": Props" : ""} = {})${isTS ? ": VDOM" : ""} {
  const [render, State] = Ura.init();
  const [getter, setter] = State${isTS ? "<number>" : ""}(0);

  return render(() => (
    <div className="${isTailwind
      ? "flex flex-col items-center justify-center text-center h-full w-full bg-[#282c34] text-white"
      : className
    }">
      <h1 className="${isTailwind ? "text-4xl mb-4 text-white" : ""}">
        Hello from ${capitalize(base)} component!
      </h1>
      <button className="${isTailwind
      ? "h-[100px] w-[100px] text-lg font-bold bg-[#3178c6] text-white border-none rounded-full cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white hover:text-[#3178c6]"
      : ""
    }" onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}

export default ${capitalize(base)};
`;
}

function generateStyle() {
  const styling = GET("STYLE_EXTENTION");
  return styling === "scss" ? `.${className} {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  background: #282c34;
  color: #ffffff;
  h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #ffffff;
  }

  button {
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

    &:hover {
      background-color: #ffffff;
      color: #3178c6;
    }
  }
}`: styling === "css" ? `.${className} {
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

.${className} h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #ffffff;
}

.${className} button {
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

.${className} button:hover {
  background-color: #ffffff;
  color: #3178c6;
}`: "";
}


try {
  mkdirSync(dir, { recursive: true });

  const jsxContent = generateComponent();
  writeFileSync(jsFile, jsxContent);
  if (["css", "scss"].includes(GET("STYLE_EXTENTION"))) {
    const cssFilePath = join(dir, `${base}.${GET("STYLE_EXTENTION")}`);
    const cssContent = generateStyle();
    writeFileSync(cssFilePath, cssContent);
  }

  console.log(`Component "${routeName}" created successfully`);
  updateRoutes();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
