import React, { useEffect, useState } from "react";
import "./BlogList.css";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchPosts();
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  };

  const handleEdit = (post) => {
    setEditPost({ ...post });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${editPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPost),
      });
      if (!res.ok) throw new Error("Update failed");
      setEditPost(null);
      fetchPosts();
    } catch (err) {
      alert("Error updating post: " + err.message);
    }
  };

  const handleChange = (e) => {
    setEditPost({ ...editPost, [e.target.name]: e.target.value });
  };

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>

      <Link to="/createpost" className="create-button">Create New Blog</Link>

      {editPost && (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            name="title"
            value={editPost.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <textarea
            name="content"
            value={editPost.content}
            onChange={handleChange}
            placeholder="Content"
            required
          />
          <input
            type="date"
            name="date"
            value={editPost.date}
            onChange={handleChange}
            required
          />
          <input
            name="author"
            value={editPost.author}
            onChange={handleChange}
            placeholder="Author"
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditPost(null)}>Cancel</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>By {post.author} on {post.date}</small>
              <div className="btn-group">
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <a href="./homepage">Back to Home</a>
    </div>
  );
}
