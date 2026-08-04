import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllPlatforms,
  platformAdded,
  platformRemoved,
} from "../features/platformsSlice";

const Platforms = () => {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(platformAdded(name.trim()));
    setName("");
  };

  return (
    <section>
      <h2>Platforms</h2>

      <form onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New platform name"
        />
        <button type="submit">Add Platform</button>
      </form>

      <ul>
        {platforms.map((platform) => (
          <li key={platform.id}>
            {platform.name}{" "}
            <button onClick={() => dispatch(platformRemoved(platform.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Platforms;