import Ura from 'ura';
import Navbar from './utils/navbar/navbar.js';

function Login() {
  const [render, State] = Ura.init();
  const [getusers, setusers] = State([]);

  const POST = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    Ura.send("POST", "http://localhost:3000/users", {credentials: "include"}, { name, email })
      .then((res) => { if (res.status != 201) console.error("Error creating user"); })
      .catch((error) => { console.error("Error:", error); });
  };

  const GET = async (e) => {
    e.preventDefault();
    Ura.send("GET", "http://localhost:3000/users")
      .then((res) => {
        if (res.status === 200) setusers(res.data);
        else console.error("Error updating user");
      })
      .catch((error) => { console.error("Error:", error); });
  };

  return render(() => (
    <div className="login">
      <Navbar/>
      <h1>User page</h1>
      <form id="userForm" onsubmit={POST}>
        <input type="text" id="name" placeholder="Name" required />
        <input type="email" id="email" placeholder="Email" required />
        <button type="submit">Create User</button>
      </form>
      <h1>Get All Users</h1>
      <button id="getUsers" onclick={GET}>Get Users</button>
      <loop on={getusers()}>
        {(elem) => <h1>{elem.name}</h1>}
      </loop>
    </div>
  ));
}

export default Login


