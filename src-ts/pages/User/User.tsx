import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";

Mini.loadCSS("./src-ts/pages/User/User.css");

function User(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    component: () => {
      return <div>User</div>;
    },
  };
}
export default User;
