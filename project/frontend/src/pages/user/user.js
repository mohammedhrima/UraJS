import Ura from "ura";
import Foo from "./utils/foo/foo.js";

function User() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="user">
      <>
        <Foo />
        <h1>Hello from User component!</h1>
        <button onclick={() => setter(getter() + 1)}>
          clique me [{getter()}]
        </button>
        <h1>hello</h1>
      </>
    </div>
  ));
}

export default User;
