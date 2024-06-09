import Mini from "../../../Mini/lib"
import Login from "../Login/login"
import Navbar from "../_utils/Navbar/navbar"
import Avatar from "../_utils/Avatars/001.svg"
import "./home.css"

function Div1() {
    return (
        <div className="user_info">
            <img src={Avatar} />
            <div className="infos">
                <h2>Mohammed hrima</h2>
            </div>
        </div>
    )
}

function Div2() {
    return (
        <div className="game_info">
            this div 2
        </div>
    )
}

function Div3() {
    return (
        <div className="chat">
            this div 3
        </div>
    )
}

function Home() {
    return (
        <div id="home">
            <Navbar />
            <div className="components">
                <Div1 />
                <Div2 />
                <Div3 />
            </div>
        </div>
    )
}

export default Home;