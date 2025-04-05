import Ura from 'ura';
import Navbar from '../src/components/navbar.jsx';
import List from '../src/components/list.jsx';
// import User from '../../components/user.js';

// Home route
function Home(props) {
  let a = 2
  const [render, State] = Ura.init();
  const [getValue, setValue] = State(0);

  return render(() => <root>
    <div className="home">
      <div className="">
        <h1>home {getValue()}</h1>


        <button onClick={() => setValue(getValue() + 1)} >clique me</button>
      </div>

      ===================================
      {/* <List/> */}
      {
        // arr.map(e => {
        //   console.log("heee");;

        //   return <Tag2 name={e} />
        // })
      }
      {/* <Navbar /> */}
      {/* <section className="hero">
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
        </section> */}
    </div>
    {/* <List/> */}
  </root>
  );
}

export default Home;