import Ura from 'ura';

// List component

function List ()
{
  const [render, State] = Ura.init();
  const [count, setCount] = State(0);
  
  return render((props) => {
    return (
        <div className="list">
          <h2>Counter </h2>
          <p>Current Count: {count()}</p>
          <div className="button-group">
            <button onClick={() => setCount(count() + 1)}>Increment</button>
            <button onClick={() => setCount(count() - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
          </div>
        </div>
        );
  });
}


export default List
