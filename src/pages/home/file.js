import Ura from "ura"

const React = (function () {
   let componentStates = new Map();
   let componentInstances = new Map();
   let componentRoots = new Map(); // Stores root DOM nodes

   function useState(initVal) {
      const component = currentComponent;
      if (!componentStates.has(component)) {
         componentStates.set(component, []);
      }
      const states = componentStates.get(component);

      const currentIndex = states.length;
      states[currentIndex] = states[currentIndex] ?? initVal;

      return [
         () => states[currentIndex],
         (newVal) => {
            states[currentIndex] = newVal;
            updateComponent(component);
         }
      ];
   }

   let currentComponent = null;

   function render(Component, root) {
      const instance = {}; // Unique instance for state tracking
      currentComponent = instance;

      const C = Component();
      C.__Component = Component; // Store constructor reference
      componentInstances.set(instance, C); // Save instance
      componentRoots.set(instance, root); // Associate with root DOM node

      currentComponent = null; // Reset after rendering

      if (!C.__lastRendered) {
         mountComponent(C, root); // First render (CREATE)
      } else {
         updateComponent(instance); // Subsequent renders (RECONCILE)
      }

      return C;
   }

   function mountComponent(componentInstance, root) {
      const output = componentInstance.view();
      componentInstance.__lastRendered = output;
      root.innerHTML = ""; // Clear previous content
      root.appendChild(createElement(output)); // Append JSX-rendered content
      console.log("CREATE:", output);
   }

   function updateComponent(instance) {
      const component = componentInstances.get(instance);
      if (!component) return;

      const newOutput = component.view();
      const oldOutput = component.__lastRendered;
      const root = componentRoots.get(instance);

      if (JSON.stringify(newOutput) !== JSON.stringify(oldOutput)) {
         reconciliate(root, oldOutput, newOutput);
         component.__lastRendered = newOutput;
      }
   }

   function reconciliate(root, oldVNode, newVNode) {
      console.log("RECONCILE: Updating view");
      root.innerHTML = ""; // Simplified update (Replace everything)
      root.appendChild(createElement(newVNode));
   }

   function createElement(vnode) {
      if (typeof vnode === "string") {
         return document.createTextNode(vnode);
      }

      // If vnode is a function (Component), instantiate and use its view
      if (typeof vnode === "function") {
         const instance = vnode(); // Create Component instance
         return createElement(instance.view()); // Recursively process its view
      }

      const el = document.createElement(vnode.type);
      (vnode.children || []).forEach(child => el.appendChild(createElement(child)));
      return el;
   }

   return { useState, render };
})();

// JSX Component Representation
function ComponentA() {
   const [index, setIndex] = React.useState(0);
   return {
      view: () => <div>Component A: {index()}</div>,
      add: () => {
         console.log("Component A add");
         setIndex(index() + 1);
      },
   };
}

function ComponentB() {
   const [index, setIndex] = React.useState(0);
   return {
      view: () => <root>Component B: {index()}</root> ,
      add: () => {
         console.log("Component B add");
         setIndex(index() + 1);
      },
   };
}

// Usage
const rootA = document.createElement("div");
document.getElementById("root").appendChild(rootA);

const rootB = document.createElement("div");
document.getElementById("root").appendChild(rootB);

let AppA = React.render(ComponentA, rootA);
AppA.add(); // Should trigger re-render
AppA.add();

let AppB = React.render(ComponentB, rootB);
AppB.add();
