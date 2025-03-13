import Ura from 'ura';

// Navbar component
const [render, State] = Ura.init();
const [getTheme, setTheme] = State("light");

const toggleTheme = () => {
  setTheme(getTheme() === "dark" ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", getTheme());
};

const Navbar = render((props) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">UraJS</div>
      <ul className="navbar-links">
        <li>
          <a href="https://github.com/mohammedhrima/UraJS"
            target="_blank" rel="noopener noreferrer">GitHub
          </a>
        </li>
        <li>
          <button className="mode-toggle" onClick={toggleTheme}>
            {getTheme() === "light" ? "🌙" : "☀️"}
          </button>
        </li>
      </ul>
    </nav>
  );
});

export default Navbar;