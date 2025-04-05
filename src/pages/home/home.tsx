//@ts-ignore
import Ura, { VDOM, Props } from 'ura';

function Home(props: Props): VDOM {
  document.title = "home Page"
  const [render, State] = Ura.init();
  const [count, setCount] = State<number>(0);

  return render(() => (
    <root>
      <div className="home">
        <header className="navbar">
          <div className="logo">UraJS</div>
          <nav>
            <a href="https://github.com/mohammedhrima/UraJS/" target="_blank">github</a>
          </nav>
        </header>
        <main className="body">
          <h1>Hello from Home route!</h1>
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

export default Home