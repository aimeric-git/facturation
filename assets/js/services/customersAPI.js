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

export default{
    findAll: findAll,
    deleteCustomer: deleteCustomer,
    findAllInvoices: findAllInvoices,
    deleteInvoice: deleteInvoice
}