const db = require('_helpers/db');
const Transaction = db.Transaction;

module.exports = {
    create,
    getUsersTransactions,
    getTransactionsBetweenTimeframe,
    getAll,
    getTransactionReportData
};

// Create new transaction and commit to database
async function create(transactionParam) {
    const transaction = new Transaction(transactionParam);

    await transaction.save();
}

// Get a specific users past transactions
async function getUsersTransactions(username) {
    return await Transaction.find().or([{ sender: username }, {receiver: username}]);
}

// Get all transactions
async function getAll() {
    return await Transaction.find({});
}

//* Note: date format = YYYY-mm-dd
async function getTransactionsBetweenTimeframe(from, to) {
    const transactions = await Transaction.aggregate(
        [
            {
              '$match': {
                '$and': [
                  {
                    'timeStamp': {
                      '$gte': new Date(from)
                    }
                  }, {
                    'timeStamp': {
                      '$lte': new Date(to)
                    }
                  }
                ]
              }
            }, 
            {
                '$group': {
                    _id: { month: { $month: '$timeStamp' }, week: { $week: '$timeStamp' } },
                    total: { '$sum': '$amount' }
                }
            }
          ]
    );

    return transactions;
}

async function getTransactionReportData() {
    var data = {
        companyServiceProfitTotal: 0,
        companySubscriptionProfitTotal: 0,
        totalOverallYear: 0,
        totalSubYear: 0,
        totalServiceYear: 0
    };
    
    const totalSubTransYr = await Transaction.find({receiver: "roadside-assistant", for: "subscription", "$expr": { "$eq": [{"$year": "$timeStamp"}, 2019] }});
    totalSubTransYr.forEach(element => {
        data.totalSubYear += element.amount;
    });

    const totalServiceTransYr = await Transaction.find({receiver: "roadside-assistant", for: "service", "$expr": { "$eq": [{"$year": "$timeStamp"}, 2019] }});
    totalServiceTransYr.forEach(element => {
        data.totalServiceYear += element.amount;
    });    
    
    const totalSubScrptionTrans = await Transaction.find({receiver: "roadside-assistant", for: "subscription"});
    totalSubScrptionTrans.forEach(element => {
        data.companySubscriptionProfitTotal += element.amount;
    });

    const totalServiceTrans = await Transaction.find({receiver: "roadside-assistant", for: "service"});
    totalServiceTrans.forEach(element => {
        data.companyServiceProfitTotal += element.amount;
    });

    const totalOverallThisYear = await Transaction.find({receiver: "roadside-assistant", "$expr": { "$eq": [{"$year": "$timeStamp"}, 2019] }});
    totalOverallThisYear.forEach(element => {
        data.totalOverallYear += element.amount;
    });
    
    return data;
}