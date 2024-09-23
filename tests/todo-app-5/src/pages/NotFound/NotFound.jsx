// pages/NotFound/NotFound.jsx
import Mino from "../../Minotaur/code.js";

Mino.loadCSS("pages/NotFound/NotFound.css");

function NotFound() {
  return {
    render: () => (
      <>
        <h4 id="#notfound">[{location.pathname}] Not Found</h4>
      </>
    ),
  };
}
export default NotFound;
