import Ura from 'ura';
import Navbar from '../../components/navbar.js';
import List from '../../components/list.jsx';

// Home route
const [render, State] = Ura.init();
const [getValue, setValue] = State(0);

const Home = render((props) => {
  return (
    <root>
      <div className="home">
        <Navbar />
        <section className="hero">
          <h1>Welcome to UraJS</h1>
          <p>A lightweight, modern framework for building web applications.</p>
          <button className="cta-button" onClick={() => setValue(getValue() + 1)}>
            Click me [{getValue()}]
          </button>
        </section>

        <section className="features">
          <div className="feature">
            <h3>Lightweight</h3>
            <p>Minimal and fast, with no unnecessary bloat.</p>
          </div>
          <div className="feature">
            <h3>Reactive</h3>
            <p>Built-in state management and reactive updates.</p>
          </div>
        </section>
      </div>
      <List/>
    </root>
  )
});

export default Home;