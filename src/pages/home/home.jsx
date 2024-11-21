import Ura from "ura";

function Home() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);
  const handler = (e) => {
    setter(getter() + 1);
  };

  return render(() => (
    <div className="home">
    <header className="home-header">
      <h1>Welcome to UraJS</h1>
      <p> Get started by editing <code>src/pages/Home.jsx</code></p>
      <a className="home-link" href="https://github.com/mohammedhrima/UraJS"
        target="_blank" rel="noopener noreferrer">
        Learn UraJS
      </a>
    </header>
  </div>
  ));
}

export default Home;
