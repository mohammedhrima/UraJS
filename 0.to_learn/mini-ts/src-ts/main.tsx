import Mini from "./mini/mini.js";
import { MiniComponent } from "./mini/types.js";
import Home from "./pages/Home/Home.js";
import Test from "./pages/Test/Test.js";
Mini.loadCSS("./src-js/main.css");

function Test1(): MiniComponent {
  return {
    key: null,
    component: () => {
      return (
          <h1>test 1</h1>
      );
    },
  };
}

function Test2(): MiniComponent {
  return {
    key: null,
    component: () => {
      return <h1>test2</h1>;
    },
  };
}

Mini.display(
  <get by="#root">
    <Mini.Routes path="/" call={<Home/>} />
    {/* <Mini.Routes path="/" call={<Test1/>} /> */}
  </get>
);
