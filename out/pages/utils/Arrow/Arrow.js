import Ura from "ura";
function Arrow() {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24" },
        Ura.element("path", { d: "M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" }))));
}
export default Arrow;
