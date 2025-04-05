import Ura from 'ura';
import Navbar from '../src/components/navbar.jsx';
import List from '../src/components/list.jsx';
// import User from '../../components/user.js';
// Home route
function Home(props) {
    let a = 2;
    const [render, State] = Ura.init();
    const [getValue, setValue] = State(0);
    return render(() => Ura.e("root", null,
        Ura.e("div", { className: "home" },
            Ura.e("div", { className: "" },
                Ura.e("h1", null,
                    "home ",
                    getValue()),
                Ura.e("button", { onClick: () => setValue(getValue() + 1) }, "clique me")),
            "===================================")));
}
export default Home;
