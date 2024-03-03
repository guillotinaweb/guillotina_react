import { useState } from 'react'
import { Auth } from '../lib/auth'
import { Icon } from './ui/icon'
import { classnames } from '../lib/helpers'

interface Props {
  children: React.ReactNode
  onLogout: () => void
  auth: Auth
}
export function Layout({ children, onLogout, auth }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const doLogout = () => {
    auth.logout()
    onLogout()
  }

  return (
    <>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand" style={{ alignItems: 'center' }}>
            <a className="navbar-item" href="/">
              <img src="/logo.svg" alt="Guillotina logo" height="80" />
            </a>
            <div
              id="burger"
              role="button"
              className={classnames([
                'navbar-burger',
                'burger',
                isMenuOpen && 'is-active',
              ])}
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarmenu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </div>
          </div>
          <div
            id="navbarmenu"
            className={classnames(['navbar-menu', isMenuOpen && 'is-active'])}
          >
            <div className="navbar-start"></div>
            <div className="navbar-end">
              <div className="navbar-item">
                {auth.isLogged && (
                  <div className="buttons">
                    <button className="button is-size-7" onClick={doLogout}>
                      <Icon icon="fas fa-sign-out-alt" />
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
    </>
  )
}
