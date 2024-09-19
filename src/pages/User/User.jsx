// pages/User/User.jsx
import Mini from "../../mini/mini.js";

Mini.loadCSS("pages/User/User.css");

async function createUser(name, email) {
  send("POST", "http://localhost:3000/users", {}, { name, email })
    .then((response) => {
      if (response.status === 201) {
        console.log(`User created: ${response.data.name}, ${response.data.email}`);
      } else {
        console.error("Error creating user");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function User() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0);

  const handleSubmit = async (e) => {
    console.log("handle submit", e);
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    Mini.send("POST", "http://localhost:3000/users", {}, { name, email })
      .then((response) => {
        if (response.status === 201) {
          console.log(`User created: ${response.data.name}, ${response.data.email}`);
        } else {
          console.error("Error creating user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getusers = async (e) => {
    console.log("get users");

    e.preventDefault();

    Mini.send("GET", "http://localhost:3000/users")
      .then((response) => {
        if (response.status === 200) {
          console.log("User updated:", response.data);
        } else {
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
      return (
        <root>
          <>
            <form id={"userForm"} onsubmit={handleSubmit}>
              <input type={"text"} id={"name"} placeholder={"Name"} required />
              <br />
              <input type={"email"} id={"email"} placeholder={"Email"} required />
              <br />
              <button type={"submit"}>Create User</button>
            </form>
            <br />
          </>
          <>
            <h1>Get All Users</h1>
            <button id="getUsers" onclick={getusers}>
              Get Users
            </button>
            <ul id="userList"></ul>
          </>
        </root>
      );
    },
  };
}
export default User;
