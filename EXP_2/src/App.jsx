import Posts from "./components/Posts";
import Platforms from "./components/Platforms";
import "./App.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Redux Toolkit Demo</h1>

      <Platforms />

      <hr />

      <Posts />
    </div>
  );
}

export default App;