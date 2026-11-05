import "./AppLayout.css";
import Header from "../Header/Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      <Header
        onMenuOpen={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuClose={() => setIsMobileMenuOpen(false)}
      />
      {isMobileMenuOpen && (
        <div
          className="app-layout__backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <main className="app-layout__main">
        <Outlet context={{ isMobileMenuOpen, setIsMobileMenuOpen }} />
      </main>
    </div>
  );
}