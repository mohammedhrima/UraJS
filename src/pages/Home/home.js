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
  return <div>vs Username</div>;
}

function Play({ path }) {
  return (
    <div className="play_game">
      <img src={path} />
      <button>play me</button>
    </div>
  );
}

function Pie({ perce }) {
  return (
    <div className="pie" style={{ "--p": perce }}>
      {perce}%
    </div>
  );
}

function Game({ UserLevel }) {
  return (
    <div className="game">
      <div className="infos">
        <div className="level">
          <Pie perce={UserLevel}>{UserLevel}%</Pie>
        </div>
        <div className="history">
          <History />
          <History />
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
