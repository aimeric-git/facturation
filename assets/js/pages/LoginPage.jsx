import React, { useState } from 'react';
import authAPI from '../services/authAPI';

const LoginPage = ({onLogin, history}) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.currentTarget.value; 
        const name= e.currentTarget.name;

        setCredentials({ ...credentials, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try{
            await authAPI.authenticate(credentials);
            setError("");
            onLogin(true);
            history.replace("/");
        }catch(error)
        {
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas");
        }
    }

    return (
        <div>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input type="email"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                        className={"form-control" + (error && " is-invalid")} 
                    />
                    {
                        error && <p className="invalid-feedback">{error}</p>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                        className="form-control" />
                </div>
                <div className="form-group">
                    <button className="btn btn-success btn-block">Connexion</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;