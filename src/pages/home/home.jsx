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
              <i className="icon-github"></i> Star on GitHub
            </a>
            <a onclick={() => setDarkMode(!darkMode())} className="theme-toggle">
              {darkMode() ? '☀️ Light Theme' : '🌙 Dark Theme'}
            </a>
          </nav>
        </header>

        <main className="body">
          <h1 className="hero-title">
            <span className="hero-highlight">Reactive</span> Web Components,<br />
            <span className="hero-highlight">Simplified</span>
          </h1>
          
          <p className="subtitle">
            {darkMode() 
              ? "Experience the elegance of reactive programming without the complexity" 
              : "A lightweight framework that gets out of your way so you can create"}
          </p>
          
          <div className="cta-section">
            <button 
              onclick={() => setCount(count() + 1)} 
              className="primary-btn"
            >
              You've clicked me {count()} {count() === 1 ? 'time' : 'times'}
            </button>
            
            <p className="counter-message" ura-if={count() > 5}>
              Wow! You really like clicking buttons!
            </p>
          </div>
        </main>

        <footer className="footer">
          <p>
            Crafted with passion by <span className="author">Mohammed Hrima</span> • 
            Powered by <span className="ura-highlight">UraJS</span>
          </p>
          <p className="footer-note">
            Join the revolution in modern web development
          </p>
        </footer>
      </div>
    </root>
  ));
}

export default Home;