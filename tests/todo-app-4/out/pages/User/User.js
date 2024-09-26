// pages/User/User.jsx
import Mino from "../../Minotaur/code.js";
Mino.loadCSS("pages/User/User.css");
function User() {
    console.log("call users");
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    const [getusers, setusers] = state([]);
    const POST = async (e) => {
        console.log("handle submit", e);
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        Mino.send("POST", "http://localhost:3000/users", {}, { name, email })
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
        Mino.send("GET", "http://localhost:3000/users")
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
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element("h1", null, "User page"),
                Mino.element("button", { onclick: () => setter(getter() + 1) },
                    "clique me ",
                    getter()),
                Mino.element(Mino.fragment, null,
                    Mino.element("form", { id: "userForm", onsubmit: POST },
                        Mino.element("input", { type: "text", id: "name", placeholder: "Name", required: true }),
                        Mino.element("br", null),
                        Mino.element("input", { type: "email", id: "email", placeholder: "Email", required: true }),
                        Mino.element("br", null),
                        Mino.element("button", { type: "submit" }, "Create User")),
                    Mino.element("br", null)),
                Mino.element(Mino.fragment, null,
                    Mino.element("h1", null, "Get All Users"),
                    Mino.element("button", { id: "getUsers", onclick: GET }, "Get Users"),
                    Mino.element("loop", { on: getusers(), exec: (elem) => {
                            return Mino.element("h1", null, elem.name);
                        } }),
                    Mino.element("ul", { id: "userList" }))));
        },
    };
}
export default User;
