import React from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import authAPI from '../services/authAPI';

const Navbar = ({isAuthenticated, onLogout, history}) => {

    const handleLogout = () => {
		authAPI.logout();
		onLogout(false);

		toast.info("Vous êtes désoramis déconnecté ");
		history.push("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/">
		Symreact !
	</NavLink>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarColor03">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <NavLink className="nav-link" to="/customers">
			  Clients
		  </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/invoices">
			  Factures
		  </NavLink>
        </li>
        
      </ul>
      <ul className="navbar-nav ml-auto">
			{
				!isAuthenticated && <>
					<li className="nav-item">
						<NavLink className="nav-link" to="/register">
							Inscription
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="btn btn-success" to="/login">
							Connexion
						</NavLink>
					</li>
				</> ||  <li className="nav-item">
							<button className="btn btn-danger"
									onClick={handleLogout} 
							>
								Déconnexion
							</button>
						</li>
			}	
      </ul>
    </div>
  </div>
</nav>
    );
}

export default Navbar; 