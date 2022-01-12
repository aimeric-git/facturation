import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "", 
        passwordConfirm: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = (e) => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;

        setUser({...user, [name]: value});
    }

    //gestion de la soumission
    const handleSubmit = async(e) => {
        e.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm)
        {
            apiErrors.passwordConfirm = "Votre confirmation de momt de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            return; 
        }
        try
        {
                await usersAPI.register(user);
                console.log("succes--------user créé");
                setErrors({});

                //TODO: flash success
                history.replace("/login");
        }catch(error)
        {
            console.log(error.response);
            const {violations} = error.response.data;

            if(violations)
            {
                
                violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                })
                setErrors(apiErrors);
            }
        }
        console.log(user); 
    }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Saisir le prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    placeholder="Veuillez saisir le prénom..."
                    error={errors.firstName}
                />
                <Field 
                    name="lastName"
                    label="Saisir le nom"
                    value={user.lastName}
                    onChange={handleChange}
                    placeholder="Veuillez saisir le nom..."
                    error={errors.lastName}
                />
                <Field 
                    name="email"
                    label="Saisir l'adresse email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Veuillez saisir l'adresse email..."
                    type="email"
                    error={errors.email}
                />
                <Field 
                    name="password"
                    label="Saisir le mot de passe"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Veuillez saisir le mot de passe..."
                    type="password"
                    error={errors.password}
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmer le mot de passe"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    placeholder="Confirmer votre mot de passe..."
                    type="password"
                    error={errors.passwordConfirm}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <NavLink to="/login">Je suis déjà inscrit</NavLink>
                </div>
            </form>
        </>
    )
}

export default RegisterPage;