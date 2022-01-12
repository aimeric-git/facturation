import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
// start the Stimulus application
import '../bootstrap';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import '../styles/app.css';
import Navbar from './components/Navbar';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import authAPI from './services/authAPI';


authAPI.setup();


const App = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

    //pour permettre la redirection en utilisant 'history' en dehors du 
    //de la balise <Switch></Switch>
    const NavbarWithRouter = withRouter(Navbar);


    return (
        <HashRouter>
                <NavbarWithRouter isAuthenticated={isAuthenticated}
                        onLogout={setIsAuthenticated}
                />
            <Switch>
                <Route path="/login" 
                        render={(props) => <LoginPage onLogin={setIsAuthenticated} {...props} />}
                />
                
                <Route path="/register"
                        render={(props) => <RegisterPage {...props} /> }
                />
                <Route path="/customers/:id" 
                        render={(props) => <CustomerPage {...props} /> } />

                <Route path="/invoices/:id"
                        render={(props) => <InvoicePage {...props} /> } />

                <Route path="/customers"
                    render={(props) => isAuthenticated ? (
                        <CustomersPage {...props} />
                    ) : (
                        <Redirect to="/login" />
                    ) } 
                />

                <Route path="/invoices"
                    render={(props) => isAuthenticated ? (
                        <InvoicesPage {...props} />
                    ) : (
                        <Redirect to="/login" />
                    )} 
                />
               
                <Route path="/" component={HomePage} />
            </Switch>
        </HashRouter>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, rootElement);