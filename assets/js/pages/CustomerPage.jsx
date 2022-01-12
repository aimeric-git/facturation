import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';

const CustomerPage = ({match, history}) => {

    const { id = "new" } = match.params;
    
    const [customer, setCustomer] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    });
    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    });
    const [editing, setEditing] = useState(false);

    //gestion des inputs
    const handleChange = (e) => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;

        setCustomer({...customer, [name]: value});
    }

    //gestion de l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try
        {
            if(editing)
            {
                const response = await customersAPI.putCustomers(id, customer);
                history.replace("/customers"); 
            }else
            {
                const response = await customersAPI.createCustomers(customer);
                history.replace("/customers");
            }
            
            setErrors({});
        }catch(error)
        {
            const apiErrors = {};
            if(error.response.data.violations)
            {
                error.response.data.violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message; 
                }) 
                setErrors(apiErrors);
                //TODO : flash notification d'erreur
            }
        }
    }

    //récupération du customer en fonction de l'identifiant    
    const fetchCustomer = async id => {
        try
        {
            const data = await customersAPI.findOne(id);

            const {firstname, lastname, email, company} = data;
            setCustomer({firstname, lastname, email, company}); 

        }catch(error)
        {
            console.log(error.response);
            history.replace("/customers"); 
        }
    }
    
    //chargement du customer si besoins au chargement du composant
    useEffect(() => {
        if(id !== "new")
        {
            setEditing(true);
            fetchCustomer(id);
        } 
    }, [id]);

    return (
        <>
            {
                !editing ? (<h3>Création d'un client</h3>) : 
                (<h3>Modification d'un client</h3>)
            }
            
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastname"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastname}
                    onChange={handleChange}
                    error={errors.lastname}
                />
                <Field
                    name="firstname"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstname}
                    onChange={handleChange}
                    error={errors.firstname}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    )
}

export default CustomerPage; 