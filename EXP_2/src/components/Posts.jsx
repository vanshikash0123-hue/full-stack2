import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, postAdded, postRemoved } from "../features/postsSlice";
import { selectAllPlatforms } from "../features/platformsSlice";

const Posts = () => {
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? "");

  const getPlatformName = (id) =>
    platforms.find((platform) => platform.id === id)?.name ?? "Unknown";

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !platformId) return;
    dispatch(postAdded(title.trim(), platformId));
    setTitle("");
  };

  return (
    <section>
      <h2>Posts</h2>

      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
        />
        <select
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
        >
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Post</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> — {getPlatformName(post.platformId)}{" "}
            <button onClick={() => dispatch(postRemoved(post.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Posts;