import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/About/About.css");
function About() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", { id: "about" }, "about")));
        },
    };
}
export default About;
