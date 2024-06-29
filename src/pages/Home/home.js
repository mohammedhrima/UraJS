import Mini from "../../../Mini/lib";
import Login from "../Login/login";
import Navbar from "../_utils/Navbar/navbar";
import Avatar from "../_utils/Images/001.svg";
import game1 from "../_utils/Images/001.png";
import game2 from "../_utils/Images/002.png";
import game3 from "../_utils/Images/003.png";
import styled from "styled-components";

import "./home.css";

function User() {
  return (
    <div className="user">
      <div className="info">
        <img src={Avatar} />
        <div className="infos">
          <h2>Mohammed hrima</h2>
        </div>
      </div>
    </div>
  );
}

function History() {
  return (
    <div className="history">
      <h3>vs </h3>
      <img src={game1} />
      <h3>User_name</h3>
      <h3>17:05</h3>
      <span></span>
    </div>
  )
}

function Play({ path }) {
  const hover = new Mini.Variable(true);
  const name_value = new Mini.Variable("play_game bright");
  const styling = new Mini.Variable({ display: "block" });

  const check = (event) => {
    hover.value = !hover.value;
    name_value.value = name_value.value == "play_game bright" ?
      "play_game dark" : "play_game bright";
    styling.value = { display: styling.value.display == "block" ? "none" : "block" };
    // console.log("event is ", event, " value: ", hover.value);
  }

  return (
    <div
      className={name_value}
      onmouseenter={() => check("mouse over")}
      onmouseleave={() => check("mouse out")}
    >
      <img src={path} />
      <h2 style={styling} >
        Play
      </h2>
    </div>
  );
}


function Game({ UserLevel }) {

  const styling = new Mini.Variable({ backgroundColor: "blue" });
  return (
    <div className="game" style={styling}>
      <div className="infos">
        <div className="box">
          <div className="perecent">
            <svg style={{ width: "150px", height: "150px" }}>
              <circle
                cx="70" cy="70" r="70"
              ></circle>
              <circle
                cx="70" cy="70" r="70"
                style={{
                  strokeDashoffset: `calc(440 - (440 * ${UserLevel}) / 100)`
                }}
              ></circle>
            </svg>
            <div className="number">
              <h2>
                87
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
        <Play path={game1} />
        <Play path={game2} />
        <Play path={game3} />

      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="chat">
      <div className="chat_info">this div 3</div>
    </div>
  );
}

function Home() {
  return (
    <div id="home">
      <Navbar />
      <div className="components">
        <User />
        <Game UserLevel={60} />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
