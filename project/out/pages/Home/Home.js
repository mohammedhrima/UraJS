import Ura from "ura";
class Comp {
    constructor() {
        this.index = 1; // Initialize index here to avoid undefined error
        this.vdom = null;
        this.states = {};
        this.view = () => Ura.element("empty", null);
    }
    State(initialValue) {
        const stateIndex = this.index++;
        this.states[stateIndex] = initialValue;
        const getter = () => this.states[stateIndex];
        const setter = (newValue) => {
            if (!Ura.deepEqual(this.states[stateIndex], newValue)) {
                this.states[stateIndex] = newValue;
                this.updateState();
            }
        };
        return [getter, setter];
    }
    updateState() {
        console.log("call updateState");
        const newVDOM = this.view();
        if (this.vdom) {
            console.log("old:", this.vdom);
            console.log("new:", newVDOM);
            Ura.reconciliate(this.vdom, newVDOM);
        }
        else {
            this.vdom = newVDOM;
        }
    }
    render(call) {
        console.log("render :", call);
        this.view = call;
        this.vdom = call();
        return this.vdom;
    }
}
// Component definitions
function Child(props) {
    const [render, State] = Ura.init();
    const [getter, setter] = State(20);
    return render(() => (Ura.element("div", null,
        Ura.element("h1", null,
            "child ",
            props.id),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "click ",
            getter()))));
}
function Tag() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(10);
    return render(() => (Ura.element("root", null,
        Ura.element("h1", null,
            "hello world ",
            getter()),
        Ura.element("button", { onclick: () => setter(getter() + 1) }, "click"),
        Ura.element(Child, { id: getter() }))));
}
export default Tag;
