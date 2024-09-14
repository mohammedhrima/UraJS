import Mini from "../../../mini/mini.js";
Mini.loadCSS("pages/Home/Data/Data.css");
function Data() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", { id: "data" }, "home/data")));
        },
    };
}
export default Data;
