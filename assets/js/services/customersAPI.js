import axios from "axios";
import { CUSTOMERS_API } from "../config";
import { INVOICES_API } from "../config";

function findAll() {
    return axios
    .get(CUSTOMERS_API)
    
}

function findAllInvoices(){
    return axios
    .get(INVOICES_API)
}

function deleteCustomer(id) {
    return axios
        .delete("https://127.0.0.1:8001/api/customedrs/" + id)
}

function deleteInvoice(id) {
    return axios
        .delete(`https://127.0.0.1:8001/api/invoiceds/${id}`)
}

function findOneCustomer(id) {
    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => response.data);
}

function findOneInvoice(id) {
    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => response.data)
}

function putCustomers(id, customer) {
    return axios
        .put( CUSTOMERS_API + "/" + id, customer );
}

function putInvoices(id, invoice) {
    return axios
        .put(INVOICES_API + "/" +id, 
        {...invoice, customer: `/api/customers/${invoice.customer_id}` }
        )
}
function createCustomers(customer) {
    return axios
        .post(CUSTOMERS_API, customer);
}

function createInvoice(invoice) {
    return axios
        .post(INVOICES_API, 
            {...invoice, customer: `/api/customers/${invoice.customer_id}`});
}

export default{
    findAll: findAll,
    deleteCustomer: deleteCustomer,
    findAllInvoices: findAllInvoices,
    deleteInvoice: deleteInvoice,
    findOne: findOneCustomer,
    putCustomers: putCustomers,
    createCustomers: createCustomers,
    createInvoice: createInvoice,
    findOneInvoice: findOneInvoice,
    putInvoices: putInvoices
}