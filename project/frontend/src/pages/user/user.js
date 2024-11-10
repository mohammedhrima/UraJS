import Ura from 'ura';

function User() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="user">
      <h1>Hello from User component!</h1>
      <button onclick={() => setter(getter() + 1)}>
        clique me [{getter()}]
      </button>
    </div>
  ));
}
  
export default User
