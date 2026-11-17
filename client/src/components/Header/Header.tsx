import "./Header.css";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  function closeMenus() {
    onMenuClose();
    setIsAccountMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenus();
    navigate("/login");
  }

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
        {isAuthenticated && (
          <>
            <NavLink to="/knowledge" onClick={closeMenus} className={getNavLinkClass}>
              Knowledge Base
            </NavLink>
            <NavLink to="/chat" onClick={closeMenus} className={getNavLinkClass}>
              Chat
            </NavLink>
            <div className="header__account">
              <button
                type="button"
                className="header__dropdown-btn"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              >
                {currentUser ? `${currentUser.name}'s Account` : "Account"}
              </button>
              {isAccountMenuOpen && (
                <ul className="header__menu" role="menu">
                  <li role="none">
                    <button
                      type="button"
                      className="header__logout-btn"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;