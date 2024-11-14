import { useState } from "react";
import Item from "./Item";

function Home() {
  const [value, setValue] = useState(0);

  const handleClique = () => setValue(value + 1);

  return (
    <div>
      <div id="home">home counter {value}</div>
      <div>
        <Item name={value % 2 == 0 ? "odd item 1" : "even item 1"} />
        <Item name={value % 2 == 0 ? "odd item 2" : "even item 2"} />
        <Item name={value % 2 == 0 ? "odd item 3" : "even item 3"} />
      </div>
      <br />
      <button onClick={handleClique}>clique me</button>
    </div>
  );
}
export default Home;
