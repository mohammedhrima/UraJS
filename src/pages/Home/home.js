/** @jsx Mini.createElement */
/** @jsxFrag Mini.Fragment */

import { Mini } from "../../../Mini/lib.js";

function User() {
  const Go = (e) => {
    // e.preventDefault();
    Mini.Navigate("/login", "Go function");

    // iframe.src = "dist/pages/Login/login.html";
  };
  return (
    <Mini.Src name="user">
      <div className="info">
        <img src={"assets/images/001.svg"} />
        <div className="infos">
          <h2>Mohammed hrima</h2>
          <button onclick={(e) => Go(e)}>Clique me</button>
        </div>
      </div>
    </Mini.Src>
  );
}

function History() {
  return (
    <div className="history">
      <h3>vs </h3>
      <img src={"assets/images/001.png"} />
      <h3>User_name</h3>
      <h3>17:05</h3>
      <span></span>
    </div>
  );
}

function Play({ path }) {
  const hover = new Mini.Variable(false);
  const styling = new Mini.Variable({
    position: "absolute",
    visibility: "hidden",
  });

  const setHover = () => {
    // console.log("set hover to ", !hover.value);
    hover.value = !hover.value;
    if (hover.value)
      styling.value = { ...styling.value, visibility: "visible" };
    else styling.value = { ...styling.value, visibility: "hidden" };
    // console.log(styling.value);
  };

  return (
    <div className={"play_game"} onmouseover={setHover} onmouseout={setHover}>
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
      <h2 style={styling}>Play</h2>
    </div>
  );
}

function Game({ UserLevel }) {
  const styling = new Mini.Variable({ backgroundColor: "blue" });
  return (
    <Mini.Src name="game">
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
    </Mini.Src>
  );
}

function Chat() {
  return (
    <Mini.Src name="chat">
      <div className="chat_info">this div 3</div>
    </Mini.Src>
  );
}

const Components = [<User />, <Game UserLevel={60} />, <Chat />];

Components.forEach((Comp) => {
  Mini.render(Comp);
});
