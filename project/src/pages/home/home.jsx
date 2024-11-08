import Ura from 'ura';

function Play(props) {
  const [render, State] = Ura.init();
  const [setHover, getHover] = State(false);

  const getStyle = () => {
    if (getHover())
      return {
        position: "absolute",
        visibility: "hidden",
      }
    return {
      position: "absolute",
      visibility: "visible",
    }
  }
  const handleHover = () => setHover(!getHover());
  return render(() => (
    <div className={"play_game"} onmouseover={handleHover} onmouseout={handleHover}>
      <img
        src={props.path}
        loading="lazy"
        style={{
          width: "100%",
          borderRadius: "10px",
          minWidth: "100px",
          transition: "filter 0.35s ease",
        }}
      />
      <h2 style={getStyle()}>Play</h2>
    </div>
  ))
}

function History() {
  const [render, State] = Ura.init();

  return render(() => (
    <div className="history">
      <h3>vs </h3>
      <img src={"assets/007.png"} />
      <h3>User name</h3>
      <h3>17:05</h3>
      <span></span>
    </div>
  ));
}

function Game(props) {
  const [render, State] = Ura.init();

  return render(() => (
    <div className="game">
      <div className="infos">
        <div className="box">
          <div className="perecent">
            <svg style={{ width: "150px", height: "150px" }}>
              <circle cx="70" cy="70" r="70"></circle>
              <circle cx="70" cy="70" r="70"
                style={{ strokeDashoffset: `calc(440 - (440 * ${props.UserLevel}) / 100)` }}
              ></circle>
            </svg>
            <div className="number">
              <h2>
                {props.UserLevel}
                <span>%</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="histories">
          <h2>History</h2>
          <div className="table">
            <History />
            <History />
          </div>
        </div>
      </div>
      <div className="play">
        <Play path={"assets/002.png"} />
        <Play path={"assets/003.png"} />
        <Play path={"assets/004.png"} />
      </div>
    </div>
  ))
}

function Home() {
  const [render, State] = Ura.init();

  return render(() => (
    <div id="home">
      {/* User  */}
      <div className="user">
        <div className="info">
          <img src={"assets/001.svg"} loading="lazy" />
          <div className="infos">
            <h2>Mohammed hrima</h2>
            <button onclick={(e) => Ura.navigate("/login")}>Clique me</button>
          </div>
        </div>
      </div>
      {/* Game  */}
      <Game UserLevel={60} />
      {/* Chat  */}
      <div className="chat">
        <div className="chat_info">this div 3</div>
      </div>
    </div>
  ));
}

export default Home
