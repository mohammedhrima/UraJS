import Mini from "./mini/mini.js";
import { MiniComponent } from "./mini/types.js";
import Home from "./pages/Home/Home.js";
Mini.loadCSS("./src-js/main.css")

function App(): MiniComponent {
  return {
    key: null,
    component: () => {
      return (
        <div>
          <Home/>
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
