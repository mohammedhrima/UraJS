import Mini from "../../../mini/mini.js";
Mini.loadCSS("pages/Home/User2/User2.css");
function User2() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "User2")));
        },
    };
}
export default User2;
