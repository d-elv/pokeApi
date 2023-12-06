import "../../App.css";

export default function FourOhFour() {
    const imageStyle = { width: "100vw" };
    return (
        <div>
            <h1>404 - Page Not Found :(</h1>
            <img
                src="./sad_pikachu.jpeg"
                alt="sad pikachu"
                style={imageStyle}
            ></img>
        </div>
    );
}
