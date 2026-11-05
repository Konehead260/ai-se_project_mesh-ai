import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.svg";

type Props = {
 onMenuOpen: () => void;
 onMenuClose: () => void;
 isMobileMenuOpen: boolean;
};

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "header__nav-link header__nav-link_active"
    : "header__nav-link";
}

function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
  return (
    <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'}>
      <img className="header__logo" src={logo} alt="Mesh AI" />
      <button
        className="header__menu-button"
        type="button"
        aria-label="Open chat menu"
        onClick={onMenuOpen}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <nav className={isMobileMenuOpen ? 'header__nav header__nav_mobile' : 'header__nav'} aria-label="Main navigation">
        <NavLink to="/knowledge" onClick={onMenuClose} className={getNavLinkClass}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" onClick={onMenuClose} className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;