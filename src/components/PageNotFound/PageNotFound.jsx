import { useNavigate } from "react-router-dom";
import "../../App.css";
import "./PageNotFound.css";

export default function FourOhFour() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  const imageStyle = { width: "100vw" };
  return (
    <div>
      <h1 className="header">
        404 - Page Not Found:{" "}
        <button className="home-button" onClick={handleClick}>
          Click Here to return home
        </button>
      </h1>

      <img src="./sad_pikachu.jpeg" alt="sad pikachu" style={imageStyle}></img>
    </div>
  );
}
