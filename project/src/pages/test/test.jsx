import Ura from 'ura';

function Test() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="test">
      <h1>Hello from Test component!</h1>
      <button onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}

export default Test
