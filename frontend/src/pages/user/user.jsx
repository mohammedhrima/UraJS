import Ura from 'ura';
import Navbar from '../utils/Navbar/Navbar.jsx';

function User() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="user">
      <Navbar />
      <div id="center" />
      <div id="bottom">
      <div className="user-card">
        <img src="/assets/profile.png" alt="" />
        <h3>
          Hrima mohammed
        </h3>
      </div>
        <div id="games">
          <h1>
            this is games
          </h1>
        </div>
        <div id="friends">
          <h1>
            this is friends
          </h1>
        </div>
      </div>

    </div>
  ));
}

export default User
