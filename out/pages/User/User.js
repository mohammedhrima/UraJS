import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", { id: "user" }, "user")));
        },
    };
}
export default User;
