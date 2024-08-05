import { Mini } from "../../Mini/lib.js";

function Compenent() {
  return <div>test Compenent</div>;
}

Mini.render(<Compenent />, Mini.Byid("test"));
