import Ura from "ura";

class Comp {
    constructor() {
        this.index = 1; // Initialize index here to avoid undefined error
        this.vdom = null;
        this.states = {};
        this.view = () => <empty></empty>;
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
        } else {
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

    return render(() => (
        <div>
            <h1>child {props.id}</h1>
            <button
                onclick={() => setter(getter() + 1)}
            >
                click {getter()}
            </button>
        </div>
    ));
}


function Tag() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(10);

    return render(() => (
        <root>
            <h1>hello world {getter()}</h1>
            <button
                onclick={() => setter(getter() + 1)}
            >
                click
            </button>
            <Child id={getter()} />
        </root>
    ));
}

export default Tag;
