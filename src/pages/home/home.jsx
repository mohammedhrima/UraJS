import Ura from "ura";

function Home() {
  const [render, State] = Ura.init();

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
