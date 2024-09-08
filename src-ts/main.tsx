import Mini from "./mini/mini.js";
import { MiniComponent } from "./mini/types.js";
import User from "./pages/User/User.js";

function App(): MiniComponent {
  return {
    key: null,
    component: () => {
      return (
        <>
          <User/>
        </>
      );
    },
  };
}


Mini.display(
  <Mini.get by="#root">
    <App />
  </Mini.get>
);
