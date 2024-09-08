import Mini from "../../mini/mini.js";
Mini.loadCSS("./src-ts/pages/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        component: () => {
            return Mini.element("div", null, "User");
        },
    };
}
export default User;
