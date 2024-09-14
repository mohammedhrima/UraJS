import Mini from "../../../mini/mini.js";
Mini.loadCSS("pages/Home/User1/User1.css");
function User1() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "User1")));
        },
    };
}
export default User1;
