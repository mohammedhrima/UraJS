import Ura from "ura";

function Home() {
  const [render, State] = Ura.init();
  const [getTheme, setTheme] = State("dark");

  const handle = () => {
    setTheme(getTheme() === "light" ? "dark" : "light");
  };

  return render(() => (
    <div className={`home ${getTheme()}`}>
      <header className="home-header">
        <h1>Welcome to UraJS</h1>
        <p>
          Get started by editing <code>src/pages/Home.[js|ts|jsx|tsx]</code>
        </p>
        <a
          className="home-link"
          href="https://github.com/mohammedhrima/UraJS"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn UraJS
        </a>
        <button onClick={handle} className="toggle-theme">
          <span>
            Switch to {getTheme() === "light" ? "Dark" : "Light"} Mode
          </span>
          <img src="/assets/logo.png" alt="logo" />
        </button>
      </header>
    </div>
  ));
}

export default Home;
