import axios from "axios";

function findAll() {
    return axios
    .get(`https://127.0.0.1:8001/api/customers`)
    
}

function findAllInvoices(){
    return axios
    .get(`https://127.0.0.1:8001/api/invoices`)
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
        .get("https://127.0.0.1:8001/api/customers/" + id)
        .then(response => response.data);
}

function findOneInvoice(id) {
    return axios
        .get("https://127.0.0.1:8001/api/invoices/" + id)
        .then(response => response.data)
}

function putCustomers(id, customer) {
    return axios
        .put("https://127.0.0.1:8001/api/customers/" + id, customer );
}

function putInvoices(id, invoice) {
    return axios
        .put("https://127.0.0.1:8001/api/invoices/" +id, 
        {...invoice, customer: `/api/customers/${invoice.customer_id}` }
        )
}
function createCustomers(customer) {
    return axios
        .post("https://127.0.0.1:8001/api/customers", customer);
}

function createInvoice(invoice) {
    return axios
        .post("https://127.0.0.1:8001/api/invoices", 
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