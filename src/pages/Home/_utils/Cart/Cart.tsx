import Mini from "../../../../mini/mini.js";
import { MiniComponent } from "../../../../mini/types.js";
Mini.loadCSS("pages/Home/_utils/Cart/Cart.css");

function Cart(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <div className="cart">home/cart</div>
      );
    },
  };
}
export default Cart;
