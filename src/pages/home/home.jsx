import Ura from "ura";

function Home() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);
  const handler = (e) => {
    setter(getter() + 1);
  };

  return render(() => (
    <div className="home">
      <button onclick={handler}>clique me</button>
      <br /> <br />
      <h1>
        value is [{getter()}]
      </h1>
      <if cond={getter() % 2 === 1}>is odd</if>
      <if cond={getter() % 2 === 0}>is even</if>
    </div>
  ));
}

export default Home;
