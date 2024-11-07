import Ura from "ura";

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
            {/* <if cond={getter() % 2}>
                <Child id={"a"} />

            </if>
            <if cond={!getter() % 2}>
                <Child id={"b"} />

            </if> */}
        </root>
    ));
}

export default Tag;
