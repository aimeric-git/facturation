import React from 'react';
import { useEffect, useState } from 'react';
import InvoicesAPI from '../services/customersAPI';
import moment from 'moment';
import Pagination from '../components/Pagination';


const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState(''); 

    useEffect(() => {
        InvoicesAPI.findAllInvoices()
        .then(function(response){
            setInvoices(response.data["hydra:member"]);
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
            <h1>Liste des factures</h1>
           
            <div className="form-group">
                <input type="text"
                        className="form-control"
                        onChange={handleSearch}
                        placeholder="Rechercher... "
                />
            </div>

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
                                        <button className="btn btn-primary btn-sm">
                                            Editer
                                        </button>
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

            <Pagination currentPage={currentPage}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        length={filteredInvoices.length}
            />
        </>
    )
}

export default InvoicesPage; 