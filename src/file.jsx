import Ura from "ura";
    
function Form() {
  const [render, State] = Ura.init();
  const [getUsers, setUsers] = State(0);
  const POST = async (e) => {
    e.preventDefault();
    const name = document.getElementById("user_name").value;
    const email = document.getElementById("user_email").value;
    Ura.send(
      "POST", 
      "http://localhost:3000/create_user",
      {/*additional header */ },
      { name, email }
    )
    .then((res) => { if (res.status != 201) console.error("Error creating user"); })
    .catch((error) => { console.error("Error:", error); });
  };

  const GET = async (e) => {
    e.preventDefault();
    Ura.send(
      "GET", 
      "http://localhost:3000/users"
    )
    .then((res) => { if (res.status === 200) setUsers(res.data); else console.error("Error updating users"); })
    .catch((error) => { console.error("Error:", error); });
  };

  return render(() => (
    <div className="form">
      <h1>Form</h1>
      <form action="userForm" onsubmit={POST}>
        <input type="text" id="user_name" />
        <input type="text" id="user_email" />
        <button type="submit">Create User</button>
      </form>

      <h1>Get All Users</h1>
      <button onclick={GET}>Get users</button>
      <loop on={getUsers()}>{(elem) => <h1>{elem.name}</h1>}</loop>
    </div>
  ));
}

export default Form;