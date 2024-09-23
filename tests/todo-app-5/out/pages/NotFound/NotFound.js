// pages/NotFound/NotFound.jsx
import Mino from "../../Minotaur/code.js";
Mino.loadCSS("pages/NotFound/NotFound.css");
function NotFound() {
    return {
        render: () => (Mino.element(Mino.fragment, null,
            Mino.element("h4", { id: "#notfound" },
                "[",
                location.pathname,
                "] Not Found"))),
    };
}
export default NotFound;
