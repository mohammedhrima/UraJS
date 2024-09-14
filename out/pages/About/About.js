import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/About/About.css");
function About() {
    const [key, state] = Mini.initState();
    let text = "";
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element(Mini.fragment, null,
                    Mini.element("div", null, "About"),
                    Mini.element("input", { oninput: (e) => {
                            text = e.target.value;
                        } }),
                    Mini.element("button", { onclick: () => Mini.navigate(text) }, "clique me"))));
        },
    };
}
export default About;
