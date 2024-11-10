import Ura from 'ura';
import Navbar from './utils/navbar/navbar.js';
function Login() {
    const [render, State] = Ura.init();
    const [getusers, setusers] = State([]);
    const POST = async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        Ura.send("POST", "http://localhost:3000/users", {}, { name, email })
            .then((res) => { if (res.status != 201)
            console.error("Error creating user"); })
            .catch((error) => { console.error("Error:", error); });
    };
    const GET = async (e) => {
        e.preventDefault();
        Ura.send("GET", "http://localhost:3000/users")
            .then((res) => {
            if (res.status === 200)
                setusers(res.data);
            else
                console.error("Error updating user");
        })
            .catch((error) => { console.error("Error:", error); });
    };
    return render(() => (Ura.element("div", { className: "login" },
        Ura.element(Navbar, null),
        Ura.element("h1", null, "User page"),
        Ura.element("form", { id: "userForm", onsubmit: POST },
            Ura.element("input", { type: "text", id: "name", placeholder: "Name", required: true }),
            Ura.element("input", { type: "email", id: "email", placeholder: "Email", required: true }),
            Ura.element("button", { type: "submit" }, "Create User")),
        Ura.element("h1", null, "Get All Users"),
        Ura.element("button", { id: "getUsers", onclick: GET }, "Get Users"),
        Ura.element("loop", { on: getusers() }, (elem) => Ura.element("h1", null, elem.name)))));
}
export default Login;
