import Ura from 'ura';
import Navbar from '../utils/Navbar/Navbar.jsx';
import Swords from '../utils/Swords/Swords.jsx';
import WinCup from '../utils/WinCup/WinCup.jsx';
import Award from '../utils/Award/Award.jsx';

function Carousel({ images }) {
  const [render, State] = Ura.init();
  const [getIndex, setIndex] = State(0);

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return render(() => (
    <div className="carousel">
      <button className="carousel__button carousel__button--prev" onClick={prevSlide}>
        &#8592;
      </button>
      <div className="carousel__track">
        <loop on={images}>
          {(image, index) => (
            <div key={index} className={`carousel__slide ${index === getIndex() ? "carousel__slide--active" : ""}`} >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          )}
        </loop>
      </div>
      <button className="carousel__button carousel__button--next" onClick={nextSlide}>
        &#8594;
      </button>
      <div className="carousel__indicators">
        <loop on={images}>
          {(image, index) => (
            <button
              key={index}
              className={`carousel__indicator ${index === getIndex() ? "carousel__indicator--active" : ""}`}
              onClick={() => setCurrentIndex(index)} >

            </button>
          )}
        </loop>
      </div>
    </div>
  ))

}

function User() {
  const [render, State] = Ura.init();
  const [getItem, setItem] = State("item-1");
  const images = [
    "https://via.placeholder.com/600x300?text=Slide+1",
    "https://via.placeholder.com/600x300?text=Slide+2",
    "https://via.placeholder.com/600x300?text=Slide+3",
  ];


  return render(() => (
    <div className="user">
      <Navbar />
      <div id="center" >
        <div className="user-card">
          <img src="/assets/profile.png" alt="" >
          </img>
          <h3>
            Hrima mohammed
          </h3>
        </div>
      </div>
      <div id="bottom">

        <div id="games">
          <div id="history">
            <h4 id="title"><Swords /> Games</h4>
            <div className="children">
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
            </div>
          </div>
          <div id="history">
            <h4 id="title"><Award /> Winrate</h4>
            <div className="children">
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
            </div>
          </div>
          <div id="history">
            <h4 id="title"><WinCup /> Tournaments</h4>
            <div className="children">
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
              <div className="child"><o>42%</o><h4>Pongers</h4></div>
            </div>
          </div>
        </div>

        <div id="friends">
          <Carousel images={images} />

          {/* <loop on={[1, 2, 3]}>
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
          </loop> */}

          {/* <div className="cards">
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
          </div> */}

        </div>

      </div>
    </div>
  ));
}

export default User
