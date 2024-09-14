import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Home/_utils/Cart/Cart.css");
function Cart() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("div", { className: "cart" }, "home/cart"));
        },
    };
}
export default Cart;
