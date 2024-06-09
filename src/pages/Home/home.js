import Mini from "../../../Mini/lib"
import Login from "../Login/login"
import Navbar from "../_utils/Navbar/navbar"
import Avatar from "../_utils/Images/001.svg"
import "./home.css"

function UserCart() {
    return (
        <div className="user_container">
            <div className="user_info">
                <img src={Avatar} />
                <div className="infos">
                    <h2>Mohammed hrima</h2>
                </div>
            </div>
        </div>
    )
}

function MatchInfos() {
    return (
        <div className="game_container">
            <div className="game_info">
                this div 2
            </div>
        </div>
    )
}

function Chat() {
    return (
        <div className="chat_container">
            <div className="chat_info">
                this div 3
            </div>
        </div>
    )
}

function Home() {
    return (
        <div id="home">
            <Navbar />
            <div className="components">
                <UserCart />
                <MatchInfos />
                <Chat />
            </div>
        </div>
    )
}

export default Home;