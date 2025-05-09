import React, { useEffect, useState } from "react";
import "./optionlists.css";

export default function Sportslist() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/posts/category/sports")
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  const handleComment = (e, id) => setComments({ ...comments, [id]: e.target.value });
  const submitComment = (id) => {
    alert(`Comment on post ${id}: ${comments[id]}`);
    setComments({ ...comments, [id]: "" });
  };

  return (
    <div className="blog-list">
      <h2>Sports Blogs</h2>
      <a href="/HomePage" className="home-link">← Back to Home</a>

      {posts.length === 0 ? (
        <p className="no-blogs">No blogs available</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>By {post.author} on {post.date}</small>
              <p><strong>Category:</strong> {post.category}</p>

              <div className="comment-section">
                <textarea
                  placeholder="Write a comment..."
                  value={comments[post.id] || ""}
                  onChange={e => handleComment(e, post.id)}
                />
                <button onClick={() => submitComment(post.id)}>Submit</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
