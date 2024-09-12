import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Game/Game.css");

function Game(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <>
          <div>Game</div>
        </>
      );
    },
  };
}
export default Game;
    