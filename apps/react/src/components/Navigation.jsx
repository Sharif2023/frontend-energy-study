import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Home
      </Link>
      <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
        About
      </Link>
      <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;
