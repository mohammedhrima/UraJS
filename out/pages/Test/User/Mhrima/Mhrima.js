import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/User/Mhrima/Mhrima.css");
function Mhrima() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "Mhrima")));
        },
    };
}
export default Mhrima;
