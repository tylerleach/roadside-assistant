import config from 'config';
import { handleResponse, requestOptions } from '@/_helpers';

export const transactionService = {
    create,
    renewalTransaction,
    getAll,
    getUsersTransactions,
    getReportData
};

function create(transaction) {
    return fetch(`${config.apiUrl}/transactions/newTransaction`, requestOptions.post(transaction))
        .then(handleResponse)
}

function renewalTransaction(username) {
    var transactionObj = {
        sender: username,
        receiver: 'roadside-assistant',
        amount: 150,
        paymentMethod: 'credit card',
        for: 'subscription'
    };

    return fetch(`${config.apiUrl}/transactions/newTransaction`, requestOptions.post(transactionObj))
        .then(handleResponse)
}

function getAll() {
    return fetch(`${config.apiUrl}/transactions`, requestOptions.get())
        .then(handleResponse);
}

function getUsersTransactions(username) {
    return fetch(`${config.apiUrl}/transactions/${username}/pastTransactions`, requestOptions.get())
        .then(handleResponse);
}

function getReportData() {
    return fetch(`${config.apiUrl}/transactions/getTransactionData`, requestOptions.get())
        .then(handleResponse);
}