import Ura from 'ura';
function Login() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    const arr = ["item 0", "item 1", "item 2"];
    const [getusers, setusers] = State([]);
    const POST = async (e) => {
        console.log("handle submit", e);
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        console.log(name, email);
        Ura.send("POST", "http://localhost:3000/users", {}, { name, email })
            .then((response) => {
            if (response.status === 201)
                console.log(`User created: ${response.data.name}, ${response.data.email}`);
            else
                console.error("Error creating user");
        })
            .catch((error) => {
            console.error("Error:", error);
        });
    };
    const GET = async (e) => {
        console.log("get users");
        e.preventDefault();
        Ura.send("GET", "http://localhost:3000/users")
            .then((response) => {
            if (response.status === 200) {
                console.log("User updated:", response.data);
                setusers(response.data);
            }
            else {
                console.error("Error updating user");
            }
        })
            .catch((error) => {
            console.error("Error:", error);
        });
    };
    return render(() => (Ura.element("div", { className: "login" },
        Ura.element("h1", null, "User page"),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "clique me ",
            getter()),
        Ura.element("form", { id: "userForm", onsubmit: POST },
            Ura.element("input", { type: "text", id: "name", placeholder: "Name", required: true }),
            Ura.element("br", null),
            Ura.element("input", { type: "email", id: "email", placeholder: "Email", required: true }),
            Ura.element("br", null),
            Ura.element("button", { type: "submit" }, "Create User")),
        Ura.element("br", null),
        Ura.element("h1", null, "Get All Users"),
        Ura.element("button", { id: "getUsers", onclick: GET }, "Get Users"),
        Ura.element("loop", { on: getusers() }, (elem) => Ura.element("h1", null, elem.name)),
        Ura.element("ul", { id: "userList" }))));
}
export default Login;
