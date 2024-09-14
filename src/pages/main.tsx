import Mini from "../mini/mini.js";
import About from "./About/About.js";
import Home from "./Home/Home.js";
import Test from "./Test/Test.js";
import Test0 from "./Test0/Test0.js";
import Todo from "./Todo/Todo.js";
import User from "./User/User.js";
Mini.loadCSS("pages/main.css");

Mini.display(
  <>
    <route path={"/home"} call={Home}>
      <route path={"/test"} call={Test} />
    </route>
    <route path={"/test0"} call={Test0} />
    <route path={"/todo"} call={Todo} />
    <route path={"/about"} call={About} />
    <route path={"/user"} call={User} />
  </>
);
