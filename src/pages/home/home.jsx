import Ura from 'ura';

function Home(props) {
  document.title = "UraJS - Modern Web Revolution";
  const [render, State] = Ura.init();
  const [count, setCount] = State(0);
  const [darkMode, setDarkMode] = State(true);

  return render(() => (
<root>
  <div className={`home ${darkMode() ? 'dark' : 'light'}`}>
    <header className="navbar">
      <div className="logo">
        <span className="logo-ura">Ura</span>
        <span className="logo-js">JS</span>
      </div>
      <nav>
        <a href="https://github.com/mohammedhrima/UraJS/" target="_blank" className="github-link">
          <i className="icon-github"></i> GitHub
        </a>
        <a onclick={() => setDarkMode(!darkMode())} className="theme-toggle">
          {darkMode() ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </a>
      </nav>
    </header>

    <main className="body">
      <h1 className="hero-title">
        <span className="hero-highlight">Reactive</span> Web Development,<br />
        <span className="hero-highlight">Redefined</span>
      </h1>
      
      <ura-if cond={darkMode()}>
        <p className="subtitle">
          Where intuitive syntax meets powerful reactivity - build faster with less code
        </p>
      </ura-if>
      <ura-else>
        <p className="subtitle">
          The minimalist framework that delivers maximum performance without the bloat
        </p>
      </ura-else>
      
      <ura-if cond={count() > 2}>
        <p className="counter-message">
          Enjoying UraJS? Help me grow it with a <a target="_blank" href="https://github.com/mohammedhrima/UraJS/">GitHub star</a> ⭐
        </p>
      </ura-if>

      <div className="cta-section">
        <button onclick={() => setCount(count() + 1)} className="primary-btn">
          {count() > 2 ? 'Woow' : count() > 0 ? 'Counting clicks' : 'No clicks yet'} [{count()}]
        </button>
      </div>
    </main>

    <footer className="footer">
      <p>
        Crafted with Passion by <span className="author">Mohammed Hrima</span>
      </p>
    </footer>
  </div>
</root>
  ));
}

export default Home;