import Ura from "ura";
import Swords from "../Swords/Swords.jsx";
import WinCup from "../WinCup/WinCup.jsx";

function User() {
  const [render, State] = Ura.init();
  const [getItem, setItem] = State("item-1");

  return render(() => (
    <div className="user">
      <loop on={[1, 2, 3]}>
        {(elem) => (
          <input
            type="radio"
            name="slider"
            id={`item-${elem}`}
            checked={getItem() === `item-${elem}`}
            onchange={() => setItem(`item-${elem}`)}
          >
            {elem}
          </input>
        )}
      </loop>

      <div className="cards">
        <loop on={[1, 2, 3]}>
          {(elem) => (
            <label
              className="card"
              htmlFor={`item-${elem}`}
              id={`song-${elem}`}
            >
              <img src={`/assets/img${elem}.avif`} alt="song" />
            </label>
          )}
        </loop>
      </div>
    </div>
  ));
}

export default User;
