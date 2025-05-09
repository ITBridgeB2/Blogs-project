import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Register from "./Register";
import Login from "./Login";
import CreatePost from "./CreatePost";
import BlogList from "./BlogList";
import Travellist from "./Travellist";
import Cookinglist from "./Cookinglist";
import Sportslist from "./Sportslist";
import Esportslist from "./Esportslist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/bloglist" element={<BlogList />} />
        <Route path="/travellist" element={<Travellist/>}/>
        <Route path="/cookinglist" element={<Cookinglist/>}/>
        <Route path="/sportslist" element={<Sportslist/>}/>
        <Route path="/esportslist" element={<Esportslist/>}/>
      </Routes>
    </Router>
  );
}

export default App;
