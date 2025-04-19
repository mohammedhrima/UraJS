import Ura from 'ura';
import Navbar from '../../components/Navbar.js';
import Footer from '../../components/Footer.js';
import Body from '../../components/Body.js'

function Home(props) {
  document.title = "UraJS - Modern Web Revolution";
  const { render, State, createContext } = Ura.init();
  const [darkMode] = createContext("is-dark", true);

  return render(() => (
    <root>
      <div className={`home ${darkMode() ? 'dark' : 'light'}`}>
        <Navbar />
        <Body />
        <Footer />
      </div>
    </root>
  ));
}

export default Home;