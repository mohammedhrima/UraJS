// scripts/generator.js
import { capitalize, config, source } from "./utils.js";
import { join, basename } from "path";


export const generateComponent = (name, type = 'component') => {
  const isTS = config.typescript === "enable";
  const componentName = capitalize(name);
  const isRoute = type === 'route';

  return `${isTS ? '//@ts-ignore\n' : ''}import Ura${isTS ? ", { VDOM, Props }" : ""} from 'ura';

function ${componentName}(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  const [render, State] = Ura.init();
  const [count, setCount] = State${isTS ? "<number>" : ""}(0);
  
  return render(() => (
    ${isRoute ? '<root>' : ''}
    <div className="${name.toLowerCase()}">
      ${isRoute ? 
        `<h1>Hello from ${componentName} route!</h1>
            <button onclick={() => setCount(count() + 1)}> Click me [{count()}]
        </button>` : 
        `<h2>Counter</h2>
         <p>Current Count: [{count()}]</p>
         <div className="button-group">
           <button onClick={() => setCount(count() + 1)}>Increment</button>
           <button onClick={() => setCount(count() - 1)}>Decrement</button>
           <button onClick={() => setCount(0)}>Reset</button>
         </div>`}
    </div>
    ${isRoute ? '</root>' : ''}
  ));
}

export default ${componentName}`;
};

export const generateStyle = (name, type = 'component') => {
  const baseStyle = type === 'route' ? `
.${name} {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: var(--page-bg, #282c34);
  color: var(--text-color, #ffffff);
  h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }` : `
.${name} {
  text-align: center;
  padding: 20px;
  background: var(--feature-bg);
  border-radius: 10px;
  box-shadow: 0 4px 6px var(--shadow-color);
  max-width: 300px;
  margin: 20px auto;
  h2 {
    font-size: 1.75rem;
    color: var(--primary-color);
    margin-bottom: 15px;
  }`;

  const buttonStyle = type === 'route' ? `
  button {
    height: 120px;
    width: 120px;
    font-size: 20px;
    border-radius: 50%;
  }` : `
  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  button {
    height: 40px;
    flex: 1;
  }`;

  const commonButtonStyle = `
    font-weight: bold;
    color: #ffffff;
    background-color: var(--primary-color);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: var(--button-hover-bg);
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }`;

  const fullStyle = `${baseStyle}${buttonStyle}${commonButtonStyle}
  }
}`;

  return fullStyle;
};