import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/User/User.css");

function History() {
  return {
    key: null,
    render: () => {
      <div className="history">
        <h3>vs </h3>
        <img src={"assets/images/001.png"} />
        <h3>User_name</h3>
        <h3>17:05</h3>
        <span></span>
      </div>;
    },
  };
}

function Play({ path }) {
  const [key, state] = Mini.initState(); // Initialize state
  const [getHover, setHover] = state<boolean>(false);
  const [getStyle, setStyle] = state({
    position: "absolute",
    visibility: "hidden",
  });
  const handleHover = () => {
    // console.log("set hover to ", !hover.value);
    setHover(!getHover());

    if (getHover() as boolean) setStyle({ ...getStyle(), visibility: "visible" });
    else setStyle({ ...getStyle(), visibility: "hidden" });
    // console.log(styling.value);
  };

  return {
    key: key,
    render: () => {
      <div className={"play_game"} onmouseover={handleHover} onmouseout={handleHover}>
        <img
          src={path}
          loading="lazy"
          style={{
            width: "100%",
            borderRadius: "10px",
            minWidth: "100px",
            transition: "filter 0.35s ease",
          }}
        />
        <h2 style={getStyle()}>Play</h2>
      </div>;
    },
  };
}

function User() {
  console.log("User component rendered");
  const UserLevel = 60;
  const [key, state] = Mini.initState(); // Initialize state
  const Go = (e) => {};
  return {
    key: key,
    render: () => {
      return (
        <div id="home">
          <div className="components">
            <div className="user">
              <div className="info">
                <img src={"assets/images/001.svg"} loading="lazy" />
                <div className="infos">
                  <h2>Mohammed hrima</h2>
                  <button onclick={(e) => Go(e)}>Clique me</button>
                </div>
              </div>
            </div>
            <div className="game">
              <div className="infos">
                <div className="box">
                  <div className="perecent">
                    <svg style={{ width: "150px", height: "150px" }}>
                      <circle cx="70" cy="70" r="70"></circle>
                      <circle
                        cx="70"
                        cy="70"
                        r="70"
                        style={{
                          strokeDashoffset: `calc(440 - (440 * ${UserLevel}) / 100)`,
                        }}
                      ></circle>
                    </svg>
                    <div className="number">
                      <h2>
                        {UserLevel}
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
                <Play path={"assets/images/001.png"} />
                <Play path={"assets/images/002.png"} />
                <Play path={"assets/images/003.png"} />
              </div>
            </div>
            <div className="chat">
              <div className="chat_info">this div 3</div>
            </div>
          </div>
        </div>
      );
    },
  };
}

export default User;
