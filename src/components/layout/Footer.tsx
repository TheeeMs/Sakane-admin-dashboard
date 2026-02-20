import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-color text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold font-heading mb-4">Sakane</h3>
            <p className="text-sm text-light-color">
              Your trusted learning platform for quality education.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-light-color hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-light-color">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-light-color">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-light-color/20 mt-8 pt-8 text-center">
          <p className="text-sm text-light-color">
            &copy; {new Date().getFullYear()} Sakane. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
