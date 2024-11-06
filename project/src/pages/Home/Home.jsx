import Ura from "ura"

function Nav(props) {
    const [state, render] = Ura.init();
    const [getter, setter] = state(10);

    return render((props) => (
        <div>
            <h1>
                this is Nav {props.id}
            </h1>
            <button onclick={() => { setter(getter() + 1) }}>
                clique me {props.id} : {getter()}
            </button>
        </div>
    ))
}


function Home() {
    const [state, render] = Ura.init();
    const [getter, setter] = state(10);

    return render(() => (
        <root>
            <h1>
                this is home {getter()}
            </h1>
            <button onclick={() => { setter(getter() + 1) }}>
                clique me
            </button>
            <Nav id={getter() ? "a0" : "a1"}/>
            <Nav id={getter() % 2 != 0 ? "b0" : "b1"}/>
        </root>
    ))
}

export default Home