import Mini from "../../mini/mini.js";
import { MiniComponent, Props } from "../../mini/types.js";

Mini.loadCSS("src-js/components/Error/Error.css");

function Error(props: Props): MiniComponent {
  return {
    key: null,
    component: () => {
      return (
        <Mini.get by="#root">
          <h4
            style={{
              fontFamily: "sans-serif",
              fontSize: "10vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Error:{props && props["message"] ? props["message"] : ""} Not Found
          </h4>
        </Mini.get>
      );
    },
  };
}
export default Error;
