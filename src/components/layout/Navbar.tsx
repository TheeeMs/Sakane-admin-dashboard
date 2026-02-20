import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold font-heading text-heading-color"
        >
          Sakane
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-text hover:text-primary-color transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
