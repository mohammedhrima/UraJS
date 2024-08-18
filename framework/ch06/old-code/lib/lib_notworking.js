function assert(condition, message = "Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

function check(child) {
  if (typeof child === "string" || typeof child === "number") {
    return {
      type: "text",
      value: child,
    };
  }
  return child;
}

function createElement(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: (children || []).map(check),
    type: "element",
  };
}

function createFragment(vNodes) {
  assert(Array.isArray(vNodes), "createFragment expects an array of vNodes");
  return {
    type: "fragment",
    children: check(vNodes.filter((item) => item != null)),
  };
}

function destroyDOM(vdom) {
  const { type, domElement } = vdom;
  assert(!!domElement, "Can only destroy DOM nodes that have been mounted");
  switch (type) {
    case "text": {
      const { domElement } = vdom;
      assert(domElement instanceof Text);
      domElement.remove();
      break;
    }
    case "element": {
      const { domElement, children, listeners } = vdom;
      assert(domElement instanceof HTMLElement);
      domElement.remove();
      children.forEach(destroyDOM);
      if (listeners) {
        Object.entries(listeners).forEach(([eventName, handler]) => {
          domElement.removeEventListener(eventName, handler);
        });
        delete vdom.listeners;
      }
      break;
    }
    case "fragment": {
      const { domElement, children } = vdom;
      assert(domElement instanceof HTMLElement);
      children.forEach(destroyDOM);
      break;
    }
    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }
  delete vdom.domElement;
}

class EventManager {
  eventHandlers = new Map(); /* key name, value method */
  afterHandlers = [];
  
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers.includes(handler)) {
      return () => {};
    }
    handlers.push(handler);
    return () => {
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  }
  removeHandler(handler) {
    this.afterHandlers.push(handler);
    return () => {
      const idx = this.afterHandlers.indexOf(handler);
      this.afterHandlers.splice(idx, 1); // remove handler from afterhandlers
    };
  }
  trigerEvent(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach((handler) => handler(data));
    } else {
      console.warn(`No handlers for command: ${event}`);
    }
    this.afterHandlers.forEach((handler) => handler());
  }
}

function mountDOM(vdom, parentEl) {
  switch (vdom.type) {
    case "text": {
      const { value } = vdom;
      const textNode = document.createTextNode(value);
      vdom.domElement = textNode;
      parentEl.append(textNode);
      break;
    }
    case "element": {
      const { tag, props, children } = vdom;
      const element = document.createElement(tag);

      // add props
      const { on: events, ...attrs } = props;
      vdom.listeners = {};
      Object.entries(events || {}).forEach(([eventName, handler]) => {
        const listener = element.addEventListener(eventName, handler);
        vdom.listeners[eventName] = listener;
      });

      const { class: className, style, ...otherAttrs } = attrs;
      delete otherAttrs.key;

      if (className) {
        if (typeof className === "string") element.className = className;
        if (Array.isArray(className)) element.classList.add(...className);
      }

      if (style) {
        Object.entries(style).forEach(([prop, value]) => {
          element.style[prop] = value;
        });
      }

      for (const [name, value] of Object.entries(otherAttrs)) {
        if (value == null) {
          element.removeAttribute(name);
        } else if (name.startsWith("data-")) {
          element.setAttribute(name, value);
        } else {
          element[name] = value;
        }
      }

      vdom.domElement = element;
      children.forEach((child) => mountDOM(child, element));
      parentEl.append(element);
      break;
    }
    case "fragment": {
      const { children } = vdom;
      vdom.domElement = parentEl;
      children.forEach((child) => mountDOM(child, parentEl));
      break;
    }
    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
  }
}

function createApp({ state, view, stateHandlers = {} }) {
  let parentEl = null;
  let vdom = null;
  const events = new EventManager();
  const subscriptions = [events.removeHandler(renderApp)];
  console.log("subscriptions:", subscriptions);

  function sendEvent(eventName, data) {
    events.trigerEvent(eventName, data);
  }

  for (const action in stateHandlers) {
    const handler = stateHandlers[action];
    console.log("action:", action, "handler:", handler);
    const eventHandlers = events.on(action, (data) => {
      console.log("sendEvent:", action, "data:", data);
      state = handler(state, data);
      if (action == "edit-todo") {
        console.log(state);
      }
    });
    subscriptions.push(eventHandlers);
  }

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom);
    }
    vdom = view(state, sendEvent);
    mountDOM(vdom, parentEl);
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl;
      renderApp();
      return this;
    },
    unmount() {
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((removeListenner) => removeListenner());
    },
    sendEvent(eventName, data) {
      sendEvent(eventName, data);
    },
  };
}

export { createApp, createElement, createFragment };
