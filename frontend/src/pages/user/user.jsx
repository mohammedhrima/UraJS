import Ura from 'ura';
import Navbar from '../utils/Navbar/Navbar.jsx';

function User() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="user">
      <Navbar />
      <div id="center" >
        <div className="user-card">
          <img src="/assets/profile.png" alt="" >
          </img>
          <h3>
            Hrima mohammed
          </h3>
        </div>
      </div>
      <div id="bottom">

        <div id="games">
          <div id="history">
            <h4 id="title">Games</h4>
            <div className="children">
              <div className="child">42<h4>Pongers</h4></div>
              <div className="child">69<h4>Fighters</h4></div>
            </div>
          </div>
          <div id="history">
            <h4>Games</h4>
            <div className="children">
              <div className="child">42<h4>Pongers</h4></div>
              <div className="child">69<h4>Fighters</h4></div>
            </div>
          </div>
          <div id="history">
            <h4>Games</h4>
            <div className="children">
              <div className="child">42<h4>Pongers</h4></div>
              <div className="child">69<h4>Fighters</h4></div>
            </div>
          </div>
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
