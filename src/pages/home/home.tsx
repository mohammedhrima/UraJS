//@ts-ignore
import Ura, { VDOM, Props } from 'ura';

function Home(props: Props): VDOM {
  const [render, State] = Ura.init();
  const [count, setCount] = State<number>(0);
  
  return render(() => (
    <root>
    <div className="home">
      <h1>Hello from Home route!</h1>
            <button onclick={() => setCount(count() + 1)}> Click me [{count()}]
        </button>
    </div>
    </root>
  ));
}

export default Home