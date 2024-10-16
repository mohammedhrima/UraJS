// pages/Home/Home.jsx
import { deepEqual } from "src/Minotaur/utils.js";
import Mino from "../../Minotaur/code.js";
// Mino.loadCSS("pages/Home/Home.css");

function Play(props) {
  const { path } = props;
  const [key, state] = Mino.initState();
  const [getHover, setHover] = state(false);
  const [getStyle, setStyle] = state({ position: "absolute", visibility: "hidden" });

  const handleHover = () => {
    setHover(!getHover());
    if (getHover()) setStyle({ ...getStyle(), visibility: "visible" });
    else setStyle({ ...getStyle(), visibility: "hidden" });
  };
  return {
    key: key,
    render: () => (
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
      </div>
    ),
  };
}




function History() {
  
  return {
    key: null,
    render: () => (
      <div className="history">
        <h3>vs </h3>
        <img src={"assets/images/001.png"} />
        <h3>User_name</h3>
        <h3>17:05</h3>
        <span></span>
      </div>
    ),
  };
}


function Home() {
  const [key, state] = Mino.initState();
  const navigate = (path) => Mino.navigate(path);
  let UserLevel = 60;
  return {
    key: key,
    render: () => (
      <root>
        <div id="home">
          <div className={"components"}>
            {/* <!-- User --> */}
            <div className="user">
              <div className="info">
                <img src="./assets/00d1.png" loading="lazy" />
                <div className="infos">
                  <h2>Mohammed hrima</h2>
                  <button onclick={(e) => navigate("/login")}>go to navigate</button>
                </div>
              </div>
            </div>
            {/* <!-- Game --> */}
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
            {/* <!-- Chat --> */}
            <div className="chat"></div>
          </div>
        </div>
      </root>
    ),
  };
}
export default Home;

let x = 10;
let y = (x = 5);
console.log(y);
