import Mini from "../../../mini/mini.js";
Mini.loadCSS("pages/Home/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "User")));
        },
    };
}
export default User;
