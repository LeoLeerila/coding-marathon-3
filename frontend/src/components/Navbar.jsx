const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Vehicle Rental</h1>
      <div className="links">
        <a href="/">Home</a>
        <a href="/add-rental">Add Rental</a>
        <a href="/register">Register account</a>
        <a href="/login">Login in</a>
      </div>
    </nav>
  );
};

export default Navbar;
