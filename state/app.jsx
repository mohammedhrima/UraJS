/** @jsx h */

// Hyperscript function to handle JSX elements
function h(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return { nodeName, attributes, children };
  }
  
  // State management with a simple render queue
  let currentComponent = null;
  const stateMap = new Map();
  
  function useState(initialValue) {
    const component = currentComponent;
    const stateIndex = component.stateIndex++;
    
    // Initialize state if it's the first call
    if (!stateMap.has(component)) stateMap.set(component, []);
    const componentState = stateMap.get(component);
    
    // Set initial state if it doesn't exist
    if (componentState[stateIndex] === undefined) {
      componentState[stateIndex] = initialValue;
    }
  
    // State update function that triggers a re-render
    const setState = (newValue) => {
      componentState[stateIndex] = newValue;
      renderComponent(component);
    };
  
    return [componentState[stateIndex], setState];
  }
  
  function renderComponent(component) {
    const container = component.container;
    container.innerHTML = '';
    
    // Track the component during rendering to sync state
    currentComponent = component;
    component.stateIndex = 0;
  
    // Render the component and attach the resulting DOM node
    container.appendChild(render(component.type(component.props)));
  }
  
  // Render function to convert virtual DOM (vnode) to real DOM nodes
  function render(vnode) {
    if (typeof vnode === 'string') return document.createTextNode(vnode);
  
    let n = document.createElement(vnode.nodeName);
    let a = vnode.attributes || {};
    Object.keys(a).forEach(k => n.setAttribute(k, a[k]));
    (vnode.children || []).forEach(c => n.appendChild(render(c)));
  
    return n;
  }
  
  // Functional component that uses `useState`
  function Counter(props) {
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <p>Counter: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  }
  
  // Main App component with `useState` and child components
  function App(props) {
    const [parentCount, setParentCount] = useState(0);
  
    return (
      <div>
        <p>Parent Counter: {parentCount}</p>
        <button onClick={() => setParentCount(parentCount + 1)}>
          Increment Parent Counter
        </button>
        <Counter />
      </div>
    );
  }
  
  // Initial render of the App component
  const appContainer = document.getElementById('app');
  const appComponent = { type: App, props: {}, container: appContainer, stateIndex: 0 };
  renderComponent(appComponent);
  