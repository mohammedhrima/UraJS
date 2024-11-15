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
        setIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };
    return render(() => (Ura.element("div", { className: "carousel" },
        Ura.element("button", { className: "carousel__button carousel__button--prev", onClick: prevSlide }, "\u2190"),
        Ura.element("div", { className: "carousel__track" },
            Ura.element("loop", { on: images }, (image, index) => (Ura.element("div", { key: index, className: `carousel__slide ${index === getIndex() ? "carousel__slide--active" : ""}` },
                Ura.element("img", { src: image, alt: `Slide ${index + 1}` }))))),
        Ura.element("button", { className: "carousel__button carousel__button--next", onClick: nextSlide }, "\u2192"),
        Ura.element("div", { className: "carousel__indicators" },
            Ura.element("loop", { on: images }, (image, index) => (Ura.element("button", { key: index, className: `carousel__indicator ${index === getIndex() ? "carousel__indicator--active" : ""}`, onClick: () => setCurrentIndex(index) })))))));
}
function User() {
    const [render, State] = Ura.init();
    const [getItem, setItem] = State("item-1");
    const images = [
        "https://via.placeholder.com/600x300?text=Slide+1",
        "https://via.placeholder.com/600x300?text=Slide+2",
        "https://via.placeholder.com/600x300?text=Slide+3",
    ];
    return render(() => (Ura.element("div", { className: "user" },
        Ura.element(Navbar, null),
        Ura.element("div", { id: "center" },
            Ura.element("div", { className: "user-card" },
                Ura.element("img", { src: "/assets/profile.png", alt: "" }),
                Ura.element("h3", null, "Hrima mohammed"))),
        Ura.element("div", { id: "bottom" },
            Ura.element("div", { id: "games" },
                Ura.element("div", { id: "history" },
                    Ura.element("h4", { id: "title" },
                        Ura.element(Swords, null),
                        " Games"),
                    Ura.element("div", { className: "children" },
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers")),
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers")))),
                Ura.element("div", { id: "history" },
                    Ura.element("h4", { id: "title" },
                        Ura.element(Award, null),
                        " Winrate"),
                    Ura.element("div", { className: "children" },
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers")),
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers")))),
                Ura.element("div", { id: "history" },
                    Ura.element("h4", { id: "title" },
                        Ura.element(WinCup, null),
                        " Tournaments"),
                    Ura.element("div", { className: "children" },
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers")),
                        Ura.element("div", { className: "child" },
                            Ura.element("o", null, "42%"),
                            Ura.element("h4", null, "Pongers"))))),
            Ura.element("div", { id: "friends" },
                Ura.element(Carousel, { images: images }))))));
}
export default User;
