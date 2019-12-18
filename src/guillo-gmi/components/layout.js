import React from "react";
import { Icon } from "./ui/icon";

export function Layout({ children, onLogout, auth }) {
  const doLogout = ev => {
    auth.logout();
    onLogout();
  };

  return (
    <React.Fragment>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <img
                src={process.env.PUBLIC_URL + "/logo.svg"}
                alt="Guillotina logo"
                height="80"
              />
            </a>
            <a
              id="burger"
              href="/"
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarmenu"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div id="navbarmenu" className="navbar-menu">
            <div className="navbar-start"></div>
            <div className="navbar-end">
              <div className="navbar-item">
                {auth.isLogged && (
                  <div className="buttons">
                    <button className="button is-size-7" onClick={doLogout}>
                      <Icon icon="fas fa-sign-out-alt" size="is-size-7" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section className="section main">
        <div className="container">
          <div className="column">{children}</div>
        </div>
      </section>
    </React.Fragment>
  );
}
