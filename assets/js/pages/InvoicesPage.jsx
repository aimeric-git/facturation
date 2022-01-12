import React from 'react';
import { useEffect, useState } from 'react';
import InvoicesAPI from '../services/customersAPI';
import moment from 'moment';
import Pagination from '../components/Pagination';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';


const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState(''); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        InvoicesAPI.findAllInvoices()
        .then(function(response){
            setInvoices(response.data["hydra:member"]);
            setLoading(false);
        })
        .catch(function(error){
            console.log((error))
        })
    }, []);

    const CONST_CLASSES = {
        PAID: "success",
        SENT: "primary",
        CANCELLED: "danger"
    }

    const STATUT_LABELS = {
        PAID: 'Payée',
        SENT: "Envoyée",
        CANCELLED: "Annulée"
    }

    const formatDate = (str) => {
        return moment(str).format('DD/MM/YYYY')
    }

    const handleDelete = (id) => {
        const originalInvoice = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id != id));

        InvoicesAPI.deleteInvoice(id)
            .then(function(response){
                console.log('effacer-----------');
            })
            .catch(function(error){
                setInvoices(originalInvoice);
            })
        toast.success("La facture a bien été supprimée.");
    }

    const itemsPerPage = 3; 

    const handlePageChange = (page) => {
        setCurrentPage(page); 
    }

    const handleSearch = e => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
    }

    const filteredInvoices = invoices.filter(invoice => 
            invoice.customer.firstname.toLowerCase().includes(search.toLowerCase())) ||
            invoice.customer.lastname.toLowerCase().includes(search.toLowerCase()
    )
    const paginatedinvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    )

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
               <h1>Liste des factures</h1>
                <NavLink to="/invoices/new" className="btn btn-primary">
                    Créer une facture
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
                        <th>Customer_id</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Sent_at</th>
                        <th>Chrono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (invoices.length == 0 && <tr><td>Loading ...</td></tr>)
                    }
                    {
                        paginatedinvoices.map(invoice => {
                            return (
                                <tr key={invoice.id}>
                                    <td>{invoice.customer.id}</td>
                                    <td>{invoice.amount}</td>
                                    <td>
                                        <span> {invoice.status} </span>   
                                    </td>
                                    <td>{formatDate(invoice.sentAt)}</td>
                                    <td>{invoice.chrono}</td>
                                    <td>
                                            <NavLink to={"/invoices/" + invoice.id} className="btn btn-primary btn-sm">
                                                Editer

                                            </NavLink>
                                        <button className="btn btn-danger"
                                                onClick={() => handleDelete(invoice.id)} >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
                )
            }
            {
                loading && <TableLoader />
            }

            <Pagination currentPage={currentPage}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        length={filteredInvoices.length}
            />
        </>
    )
}

export default InvoicesPage; 