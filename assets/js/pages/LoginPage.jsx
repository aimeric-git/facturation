import React, { useState } from 'react';
import Field from '../components/forms/Field';
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
                <Field 
                    name="username"
                    label="Adresse email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    type="email"
                    error={error}                
                />
                
                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    type="password"
                />
                
                <div className="form-group">
                    <button className="btn btn-success btn-block">Connexion</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;