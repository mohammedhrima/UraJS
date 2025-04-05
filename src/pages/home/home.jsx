import Ura from 'ura';

function Home(props) {
  document.title = "Home Page";
  const [render, State] = Ura.init();
  const [count, setCount] = State(0);
  const [darkMode, setDarkMode] = State(true);

  return render(() => (
    <root>
      <div className={`home ${darkMode() ? 'dark' : 'light'}`}>
        <header className="navbar">
          <div className="logo">UraJS</div>
          <nav>
            <a href="https://github.com/mohammedhrima/UraJS/" target="_blank">GitHub</a>
            <a onclick={() => setDarkMode(!darkMode())}>
              {darkMode() ? 'Light Mode' : 'Dark Mode'}
            </a>
          </nav>
        </header>

        <main className="body">
          <h1>Welcome to UraJS</h1>
          <p ura-if={darkMode() == true} className="subtitle">Lightweight. 1 Reactive. Yours.</p>
          {/* <p ura-if={darkMode()} className="subtitle">Lightweight. 2 Reactive. Yours.</p> */}
          <button onclick={() => setCount(count() + 1)}>
            Click me [{count()}]
          </button>
        </main>

        <footer className="footer">
          <p>Built with 💙 using UraJS</p>
        </footer>
      </div>
    </root>
  ));
}

export default Home;