import Ura from "ura";
function User() {
    const [render, State] = Ura.init();
    const [getItem, setItem] = State("item-1");
    return render(() => (Ura.element("div", { className: "user" },
        Ura.element("loop", { on: [1, 2, 3] }, (elem) => (Ura.element("input", { type: "radio", name: "slider", id: `item-${elem}`, checked: getItem() === `item-${elem}`, onchange: () => setItem(`item-${elem}`) }, elem))),
        Ura.element("div", { className: "cards" },
            Ura.element("loop", { on: [1, 2, 3] }, (elem) => (Ura.element("label", { className: "card", htmlFor: `item-${elem}`, id: `song-${elem}` },
                Ura.element("img", { src: `/assets/img${elem}.avif`, alt: "song" }))))))));
}
export default User;
