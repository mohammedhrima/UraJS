import Ura from 'ura';

function Body(props) {
  const { render, State, getContext } = Ura.init();
  const [count, setCount] = State(0);
  const [darkMode, setDarkMode] = getContext("is-dark");

  return render(() => (
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

  ));
}

export default Body