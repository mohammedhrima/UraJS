import Ura from 'ura';

function Home() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div id="home">
      {/* User  */}
      <div className="user">
        <div className="info">
          <img src={"../../assets/001.svg"} loading="lazy" />
          <div className="infos">
            <h2>Mohammed hrima</h2>
            <button onclick={(e) => Ura.navigate("/login")}>Clique me</button>
          </div>
        </div>
      </div>
      {/* Game  */}
      <div className="game">
        
      </div>
      {/* Chat  */}
      <div className="chat">

      </div>
    </div>
  ));
}

export default Home
