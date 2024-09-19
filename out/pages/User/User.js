// pages/User/User.jsx
import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/User/User.css");
function User() {
    console.log("call users");
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    const [getusers, setusers] = state([]);
    const POST = async (e) => {
        console.log("handle submit", e);
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        Mini.send("POST", "http://localhost:3000/users", {}, { name, email })
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
        Mini.send("GET", "http://localhost:3000/users")
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
            return (Mini.element("root", null,
                Mini.element("h1", null, "User page"),
                Mini.element("button", { onclick: () => setter(getter() + 1) },
                    "clique me ",
                    getter()),
                Mini.element(Mini.fragment, null,
                    Mini.element("form", { id: "userForm", onsubmit: POST },
                        Mini.element("input", { type: "text", id: "name", placeholder: "Name", required: true }),
                        Mini.element("br", null),
                        Mini.element("input", { type: "email", id: "email", placeholder: "Email", required: true }),
                        Mini.element("br", null),
                        Mini.element("button", { type: "submit" }, "Create User")),
                    Mini.element("br", null)),
                Mini.element(Mini.fragment, null,
                    Mini.element("h1", null, "Get All Users"),
                    Mini.element("button", { id: "getUsers", onclick: GET }, "Get Users"),
                    Mini.element("loop", { on: getusers(), exec: (elem) => {
                            return Mini.element("h1", null, elem.name);
                        } }),
                    Mini.element("ul", { id: "userList" }))));
        },
    };
}
export default User;
