import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
import "./User.css"

function User(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    component: () => {
      return <div className="user">User</div>;
    },
  };
}
export default User;

