import Mini from "./Mini/lib";
let Greet = () => Mini.element("h1", null, "Hello, world!");
Mini.render(Mini.element(Greet, null), document.getElementById("app"));
