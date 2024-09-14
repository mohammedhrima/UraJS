import Mini from "../../mini/mini.js";
Mini.loadCSS("src-js/components/Error/Error.css");
function Error(props) {
    return {
        key: null,
        component: () => {
            return (Mini.element(Mini.get, { by: "#root" },
                Mini.element("h4", { style: {
                        fontFamily: "sans-serif",
                        fontSize: "10vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    } },
                    "Error:",
                    props && props["message"] ? props["message"] : "",
                    " Not Found")));
        },
    };
}
export default Error;
