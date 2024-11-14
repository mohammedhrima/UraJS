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
        else console.error("Error creating user");
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
          <h1>User page</h1>
          <button onclick={() => setter(getter() + 1)}>clique me {getter()}</button>
          <>
            <form id={"userForm"} onsubmit={POST}>
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
            <button id="getUsers" onclick={GET}>
              Get Users
            </button>

            {/* {getusers().map((elem) => {
              return  <h1> {elem.name}</h1> ;
            })} */}

            <loop
              on={getusers()}
              exec={(elem) => {
                return <h1>{elem.name}</h1>;
              }}
            />
            <ul id="userList"></ul>
          </>
        </root>
      );
    },
  };
}
export default User;
