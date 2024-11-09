import Ura from 'ura';

function Login() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);
  const arr = ["item 0", "item 1", "item 2"]
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
        else console.error("Error creating user");
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
        } else {
          console.error("Error updating user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return render(() => (
    <div className="login">
      <h1>User page</h1>
      <button onclick={() => setter(getter() + 1)}>clique me {getter()}</button>

      <form id={"userForm"} onsubmit={POST}>
        <input type={"text"} id={"name"} placeholder={"Name"} required />
        <br />
        <input type={"email"} id={"email"} placeholder={"Email"} required />
        <br />
        <button type={"submit"}>Create User</button>
      </form>
      <br />

      <h1>Get All Users</h1>
      <button id="getUsers" onclick={GET}>
        Get Users
      </button>

      <loop on={getusers()}>
        {(elem) => <h1>{elem.name}</h1>}
      </loop>
      <ul id="userList"></ul>

    </div>
  ));
}

export default Login
