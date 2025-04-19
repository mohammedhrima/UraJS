import Ura from 'ura';

function Navbar(props) {
  const { render, State, getContext } = Ura.init();
  const [darkMode, setDarkMode] = getContext("is-dark");

  return render(() => (
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

  ));
}

export default Navbar