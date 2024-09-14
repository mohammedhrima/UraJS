import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/About/About.css");

function About(): MiniComponent {
  const [key, state] = Mini.initState();
  let text = "";
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <>
            <div>About</div>
            <input
              oninput={(e) => {
                text = e.target.value;
              }}
            />
            <button onclick={() => Mini.navigate(text)}>clique me</button>
          </>
        </get>
      );
    },
  };
}
export default About;
