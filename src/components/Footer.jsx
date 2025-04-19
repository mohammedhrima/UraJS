import Ura from 'ura';

function Footer(props) {
  const { render } = Ura.init();

  return render(() => (
    <footer className="footer">
      <p>
        Crafted with Passion by <span className="author">Mohammed Hrima</span>
      </p>
    </footer>
  ));
}

export default Footer