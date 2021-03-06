import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../services/customersAPI';

const InvoicePage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        customer_id: "",
        amount: "",
        status: "SENT",
    });
    const [errors, setErrors] = useState({
        customer_id: "",
        amount: "",
        status: "",
    });
    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);

    const handleChange = (e) => {
        const value = e.currentTarget.value; 
        const name = e.currentTarget.name;

        setInvoice({...invoice, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try
        {
            if(editing)
            {
                await customersAPI.putInvoices(id, invoice);

                toast.success("La facture a bien été modifiée.");
                history.replace("/invoices");
            }else
            {
                await customersAPI.createInvoice(invoice);
                    
                toast.success("La facture a bien été créée.");
                history.replace("/invoices");
            }
        }catch(error)
        {
            console.log(error.response);
            toast.error("Une erreur s'est produite!!");
        }
    }

    //récupérer un customer en fonction de l'identifiant
    const fetchInvoice = async (id) => {
        try
        {
            const data = await customersAPI.findOneInvoice(id);
            const {customer_id, amount, status} = data;
            setInvoice({customer_id: data.customer.id, amount, status});
            toast.success("Facture récupérée");
        }catch(error)
        {
            console.log("----error fetchInvoice -------", error.response);
            toast.error("Impossible de charger la facture");
            history.replace("/invoices");
        }
    }

    const fetchCustomers = async () => {
       try
       {
            const data = await customersAPI.findAll();
            setCustomers(data.data["hydra:member"]);
       }catch(error)
       {
            const apiErrors = {};
                if(error.response.data.violations)
                {
                    error.response.data.violations.map(violation => {
                        apiErrors[violation.propertyPath] = violation.message; 
                    }) 
                    setErrors(apiErrors);
                    toast.error("Impossible de charger les clients.");
                }
       }
    }

    useEffect(() => {
        if(id !== "new")
        {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomers(); 
    }, []);

    return (
        <>
            {
                editing ? (
                    <h3>Modification d'une facture</h3>
                ) : (
                    <h3>Création d'une facture</h3>
                )
            }
            <form onSubmit={handleSubmit}>
                
                <Select
                    name="customer_id"
                    label="client"
                    value={invoice.customer_id}
                    error={errors.customer_id}
                    onChange={handleChange}
                >
                    {customers.map(customer => {
                        return (
                            <option key={customer.id} value={customer.id}>
                                {customer.firstname} 
                            </option>
                            )
                        }
                        )
                    }
                            
                </Select>

                <Select
                    name="status"
                    label="Status"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <Field 
                    name="amount"
                    label="montant de la facture"
                    value={invoice.amount}
                    onChange={handleChange}
                    placeholder="Veuillez saisir le montant"
                    type="text"
                    error={errors.amount}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    )
}

export default InvoicePage; 