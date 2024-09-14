import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    // Mini.navigate("/test", {id:10})
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "User")));
        },
    };
}
export default User;