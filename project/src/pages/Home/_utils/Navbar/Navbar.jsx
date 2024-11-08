import Ura from 'ura';

function Navbar() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="navbar">
      <h1>Hello from Navbar component!</h1>
      <button onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}
  
export default Navbar
