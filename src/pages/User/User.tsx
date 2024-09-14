import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/User/User.css");

function User(): MiniComponent {
  const [key, state] = Mini.initState();
  // Mini.navigate("/test", {id:10})
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div>User</div>
        </get>
      );
    },
  };
}
export default User;
    