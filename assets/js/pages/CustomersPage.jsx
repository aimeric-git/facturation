import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/customersAPI';

const CustomersPage = () => {
    
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    //au chargement du composant on va chercher les customers
    useEffect(() => {
       CustomersAPI.findAll()
            .then(function(response){
                setCustomers(response.data["hydra:member"]);
                setLoading(false); 
            })
            .catch(error => console.log(error.response))
    }, []);

    //gestion de la suppresion d'un customer
    const handleDelete = async (id) => {

        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        try{
            await CustomersAPI.deleteCustomer(id)
            toast.success("Le client a bien été supprimée.");
        }catch(error)
        {
            setCustomers(originalCustomers);
            console.log(error.response); 
        }
        
    }

    //gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page); 
    }

    //gestion de la recherche
    const handleSearch = (e) => {
        const valeur = e.currentTarget.value;
        setSearch(valeur);
        setCurrentPage(1);
    }

    const itemsPerPage = 7;

    //filtrage des customers
    const filteredCustomers = customers.filter(c => 
        c.lastname.toLowerCase().includes(search.toLowerCase()) ||
        c.firstname.toLowerCase().includes(search.toLocaleLowerCase())
    );

    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    );

    
    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
               <h1>Liste des clients</h1>
                <NavLink to="/customers/new" className="btn btn-primary">
                    Créer un client
                </NavLink>
            </div>
            <div className="form-group">
                <input type="text"
                        className="form-control"
                        onChange={handleSearch}
                        placeholder="Rechercher... "
                />
            </div>
            {
                !loading && (
                    <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                   
                    {
                        paginatedCustomers.map((customer) => {
                                return (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>
                                            <span><NavLink to={"/customers/" + customer.id}>{customer.firstname} {customer.lastname}</NavLink></span>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.company}</td>
                                        <td className="text-center">
                                            {customer.invoices.length}
                                        </td>
                                        <td className="text-center">{customer.totalAmount}</td>
                                        <td>
                                            <button className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(customer.id)}
                                                disabled={customer.invoices.length > 0 ? true : false}>
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                    
                </tbody>
            </table>
                )
            }
            {
                loading && <TableLoader />
            }

            {
                itemsPerPage < filteredCustomers.length && <Pagination 
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length} 
                /> 
            }
            
        </>
    );
}

export default CustomersPage; 