import React from 'react'

export function Layout({children, onLogout, auth}) {

  const doLogout = (ev) => {
    auth.logout()
    onLogout()
  }

  return (
    <>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <img src={process.env.PUBLIC_URL + '/logo.svg'}
                alt="Guillotina logo"
                height="80"
                />
            </a>
            <a id="burger"
              href="/"
              role="button" className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarmenu">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div id="navbarmenu" className="navbar-menu">
            <div className="navbar-start">

            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  {auth.isLogged && <button className="button" onClick={doLogout}>Logout</button>}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section className="section main">
        <div className="container">
          <div className="column">
            {children}
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">
          <span>guillotina react</span>
        </div>
      </footer>
    </>
  )
}
