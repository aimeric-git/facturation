import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
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
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';




const App = () => {
    return (
        <HashRouter>
                    <Navbar />
            <Switch>
                <Route path="/customers" component={CustomersPage} />
                <Route path="/invoices" component={InvoicesPage} />
                <Route path="/" component={HomePage} />
            </Switch>
        </HashRouter>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, rootElement);