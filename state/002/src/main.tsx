const ELEMENT = "element";
const TEXT = "text";

const CREATE = 1;
const UPDATE = 2;
const REMOVE = 3;

function check(childen) {
   const res = [];
   childen.map(child => {
      if (["string", "number"].includes(typeof child)) res.push({ type: TEXT, value: child });
      //@ts-ignore
      else if (Array.isArray(child)) res.push(...check(child));
      else if (child) res.push(child);
   });
   return res;
}

const states = new Map();

function element(tag, props = {}, ...childen) {
   if (typeof tag === "function") {
      let ret = tag(props, childen);
      return ret;
   }
   return {
      type: ELEMENT,
      tag: tag,
      childen: check(childen)
   }
}

function setProps(vdom) {
   const { props } = vdom;
   const style = {};
   Object.keys(props || {}).forEach((key) => {
      if (key === "class") {
         console.warn("Invalid property 'class' did you mean 'className' ?", vdom);
         key = "className";
      }
      if (key.startsWith("on")) {
         const eventType = key.slice(2).toLowerCase();
         if (eventType === "hover") {
            vdom.dom.addEventListener("mouseover", props[key]);
            vdom.dom.addEventListener("mouseout", props[key]);
         } else vdom.dom.addEventListener(eventType, props[key]);
      } else if (key === "style") Object.assign(style, props[key]);
      else  vdom.dom[key] = props[key];
      
   });
   if (Object.keys(style).length > 0) {
      vdom.dom.style.cssText = Object.keys(style).map((styleProp) => {
            const Camelkey = styleProp.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            return `${Camelkey}:${style[styleProp]}`;
         }).join(";");
   }
}

function removeProps(vdom) {
   try {
      const props = vdom.props;
      for (const key of Object.keys(props || {})) {
         if (vdom.dom) {
            if (key.startsWith("on")) {
               const eventType = key.slice(2).toLowerCase();
               vdom.dom?.removeEventListener(eventType, props[key]);
            } else if (key === "style") {
               Object.keys(props.style || {}).forEach((styleProp) => {
                  vdom.dom.style[styleProp] = "";
               });
            } else if (vdom.dom) {
               if (vdom.dom[key] !== undefined) delete vdom.dom[key];
               else vdom.dom?.removeAttribute(key);
            }
         } else delete props[key];
      }
      vdom.props = {};
   } catch (error) {
      // console.log("remove props");
   }
}

function destroy(vdom ) {
   removeProps(vdom);
   vdom.dom?.remove();
   vdom.dom = null;
   vdom.children?.map(destroy);
}

function createDOM(vdom) {
   switch (vdom.type) {
      case ELEMENT: {
         if (vdom.tag === "root") vdom.dom = document.getElementById("root");
         else vdom.dom = document.createElement(vdom.tag)
         break;
      }
      case TEXT: {
         vdom.dom = document.createTextNode(vdom.value);
         break
      }
      default:
         break;
   }
}

function execute(mode, vdom) {
   switch (mode) {
      case CREATE: {
         createDOM(vdom);
         vdom.childen?.forEach(child => {
            execute(CREATE, child)
            if (child.dom) vdom.dom.appendChild(child.dom);
         });
         setProps(vdom);
         break;
      }
      default: {
         console.error("handle this case ", mode);
         break;
      }
   }
   return vdom;
}

let GlobalVDOM = null;
function render(vdom) {
   execute(CREATE, vdom);
   GlobalVDOM = vdom;
}

const map = new Map();
let index = 0;
function useState(state) {
   const v = index++;

   map[v] = state;
   const getter = () => map[v];
   const setter = (value) => { map[v] = value };

   return [getter, setter];
}

function App() {
   const [getter, settter] = useState(10);

   return (
      <root>
         <div>
            {/* @ts-ignore */}
            {getter()}
         </div>
      </root>
   )
}

render(<App/>);
console.log(GlobalVDOM);
