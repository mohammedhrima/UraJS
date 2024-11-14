// pages/Home/_utils/Item/Item.jsx
import { useState } from "react";

function Item(props) {
  const [value, setValue] = useState(0);

  const handleClique = () => setValue(value + 1);
  return (
    <div>
      <h1>{props.name}</h1>
      <button onClick={handleClique}>clique me {value}</button>
    </div>
  );
}
export default Item;
