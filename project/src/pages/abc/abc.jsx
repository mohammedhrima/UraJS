import Ura from 'ura';

function Abc() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="abc">
      <h1>Hello from Abc component!</h1>
      <button onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}
  
export default Abc
