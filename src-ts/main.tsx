// import * from "./main.css"
// @import url(' http://server/stylesheet.css ');
import Mini from "./mini/mini.js";
import { MiniComponent } from "./mini/types.js";
import User from "./pages/User/User.js";

Mini.loadCSS("./src-js/main.css")
console.log("hello");


function App(): MiniComponent {
  return {
    key: null,
    component: () => {
      return (
        <div>
          <User/>
        </div>
      );
    },
  };
}

Mini.display(
  <Mini.get by="#root">
    <App />
  </Mini.get>
);
