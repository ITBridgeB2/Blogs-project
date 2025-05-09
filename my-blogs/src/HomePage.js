import React from "react";
import "./HomePage.css";
import { useNavigate, Link } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const imageLinks = [
    { src: "sports.jpg", url: "/sportslist", label: "Sports" },
    { src: "travel.jpg", url: "/travellist", label: "Travel" },
    { src: "cooking.jpg", url: "/cookinglist", label: "Cooking" },
    { src: "esports.jpg", url: "/esportslist", label: "Esports" },
  ];

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>My Blogs</h1>
        <div className="auth-buttons">
          <button className="login" onClick={handleLogin}>Login</button>
          <button className="register" onClick={handleRegister}>Register</button>
        </div>
      </div>

      <div className="image-grid">
        {imageLinks.map((item, index) => (
          <Link to={item.url} key={index} className="image-item">
            <img src={item.src} alt={item.label} />
            <p className="image-label">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
