import { Link } from "react-router-dom"

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {

  const handleClick = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  }

  return (
    <nav className="navbar">
      <h1>Vehicle Rental</h1>
      <div className="links">
        <Link to="/">Home</Link>

        {isAuthenticated && (
          <div>
            <span>{JSON.parse(localStorage.getItem("user")).username}</span>
            <button onClick={handleClick}>Logout</button>
            <a href="/add-rental">Add Rental</a>
          </div>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/register"></Link>
            <Link to="/login"></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
