import Mini from "../../../mini/mini.js";
Mini.loadCSS("pages/About/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "about/user")));
        },
    };
}
export default User;
