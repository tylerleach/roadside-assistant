const express = require('express');
const transactionService = require('./transaction.service');
const authorize = require('_helpers/authorize');
const router = express.Router();

// Routes
router.post('/newTransaction', authorize(), createTransaction);
router.get('/', authorize('Admin'), getAllTransactions); // Admin only route
router.get('/:username/pastTransactions', authorize(), getPastTransactions);
router.get('/getTransactionData', authorize(), getReportData);
router.get('/getCompanyEarnings/specific', authorize(), getEarningsBetweenDates);

module.exports = router;

function createTransaction(req, res, next) {
    transactionService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllTransactions(req, res, next) {
    transactionService.getAll()
        .then(transactions => res.json(transactions))
        .catch(err => next(err));
}

function getPastTransactions(req, res, next) {
    transactionService.getUsersTransactions(req.params.username)
        .then(transactions => res.json(transactions))
        .catch(err => next(err));
}

function getReportData(req, res, next) {
    transactionService.getTransactionReportData()
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getEarningsBetweenDates(req, res, next) {
    transactionService.getCompanyIncomeFromServices(req.body.from, req.body.to)
        .then(transactions => res.json(transactions))
        .catch(err => next(err));
}