// MACROS
export const ELEMENT = "element";
export const FRAGMENT = "fragment";
export const TEXT = "text";
export const IF = "if";
export const ELSE = "else";
export const EXEC = "exec";
// export const ELIF = "elif";
export const LOOP = "loop";
export const CREATE = 1;
export const REPLACE = 2;
export const REMOVE = 3;
// CSS
export function loadCSS(filename) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = filename;
  document.head.appendChild(link);
}
// UTILS
export function deepEqual(a, b) {
  if (a !== a && b !== b) return true; // NaN is the only value that is not equal to itself
  if (a === b) return true; // Handle primitive type comparison
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (typeof a === "function" && typeof b === "function") return a.toString() === b.toString();
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

export function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepCopy(obj[key]);
    }
  }
  return clone;
}

export const svgElements = new Set([
  "svg", // The root SVG container
  "path", // Defines a shape with a series of points and commands
  "circle", // Defines a circle with a center point and radius
  "rect", // Defines a rectangle
  "line", // Defines a straight line between two points
  "polyline", // Defines a series of connected straight lines
  "polygon", // Defines a closed shape made of straight lines
  "ellipse", // Defines an ellipse with a center point, radiusX, and radiusY
  "text", // Defines text
  "tspan", // A container for text with a position adjustment
  "textPath", // Aligns text along a path
  "defs", // Container for elements that can be reused in the SVG
  "g", // Group container for grouping multiple elements
  "symbol", // Defines reusable elements
  "use", // References reusable elements
  "image", // Embeds an image
  "marker", // Defines arrowheads or other markers
  "linearGradient", // Defines a linear color gradient
  "radialGradient", // Defines a radial color gradient
  "stop", // Defines a color stop in a gradient
  "clipPath", // Defines a clipping path
  "mask", // Defines a mask
  "pattern", // Defines a repeating pattern
  "filter", // Defines a filter effect
  "feGaussianBlur", // Example of a filter (Gaussian blur)
  "feOffset", // Example of a filter (Offset)
  "feBlend", // Example of a filter (Blend)
  "feColorMatrix", // Example of a filter (Color matrix)
  "foreignObject", // Embeds external content, such as HTML
  // add other elements as needed
]);
