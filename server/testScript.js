const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const db = require('./_helpers/db');
const User = db.User;
const Member = db.Member;
const Professional = db.Professional;
const Request = db.Request;
const Transaction = db.Transaction;

/* 
    Ensure that you have Mongodb installed first and a database in it called roadside-assistant.
*/

console.log("Connection Successful!");

// Default Admin User
var user1 = new User({ username: 'Admin', hash: 'fill-in', firstName: 'Admin', lastName: 'Privleges', role: 'Admin' });
// Password
var password = "administrator";
// Hashes the password for storage
user1.hash = bcrypt.hashSync(password, 10);

// Save model to database
user1.save(function (err, user) {
    if (err) return console.error(err);
    console.log(user.username + " saved to the user collection.");
});

var memberArray = []; // Array of member documents
var proArray = []; // Array of professional documents
var requestArray = []; // Array of request documents
var transactionArray = []; // Array of transaction documents

/* Main Section */
console.log('Creating test members...');
createTestMembers();
console.log('Creating test professionals...');
createTestProfessionals();
console.log('Creating test requests...');
createTestRequests();
Transaction.insertMany(transactionArray).then(function() {
    console.log('Transactions committed to database.');
    console.log('-- FINISHED DATA PERSISTENCE TO DB --');
})
.catch(function(err) {
   console.log(err);
})

console.log('-- FINISHED DATA CREATION --');
console.log('');
console.log('Number of members created: ' + memberArray.length);
console.log('Number of professionals created: ' + proArray.length);
console.log('Number of requests created: ' + requestArray.length);
console.log('Number of transactions created: ' + transactionArray.length);


/* Functions: */

// Create 50 subscription members then 50 per-service members
function createTestMembers() {
    for (let index = 0; index < 100; index++) {
        if (index <= 49) {
            createMember('Subscription');
        } else if (index >= 50) {
            createMember('Per-service');
        }
    }

    Member.insertMany(memberArray).then(function() {
        console.log('Members committed to database.');
    })
    .catch(function(err) {
       console.log(err);
    });
}

// Create a new member object given the membership type
function createMember(mType) {
    var fName = faker.name.firstName();
    var lName = faker.name.lastName();
    var options = {min: 1, max: 12};
    var mnth = faker.random.number(options);
    options.min = 19;
    options.max = 24;
    var yr = faker.random.number(options);
    var exp = mnth + '/' + yr;

    var tempCard = {
        firstName: fName,
        lastName: lName,
        cardNumber: (Math.random() + ' ').substring(2,10)+(Math.random()+' ').substring(2,10),
        expDate: exp,
        CVV: Math.floor(Math.random()*(999-100+1)+100)
    };

    var tempMember = {
        username: faker.internet.userName(fName, lName),
        hash: bcrypt.hashSync(faker.internet.password(10, true), 10),
        firstName: fName,
        lastName: lName,
        dateCreated: faker.date.past(3),
        membershipType: mType,
        expirationDate: faker.date.future(1),
        creditCard: tempCard
    };

    if (mType == 'Per-service') {
        tempMember.expirationDate = null;
    } else {
        var tmpTransaction = {
            sender: tempMember.username,
            receiver: 'roadside-assistant',
            amount: 150,
            for: 'subscription',
            timeStamp: ''
        };
        createTestTransaction(tempMember, tmpTransaction);
    }

    var member = new Member(tempMember);
    memberArray.push(member); // Commit member to the memberArray
}

// Creates 100 professionals and also adds reviews for the professional :)
function createTestProfessionals() {
    var options = { min: 100000, max: 999999 }; // BSB number range

    for (let index = 0; index < 100; index++) {
        var numOfReviews = Math.floor(Math.random() * 5); // Between 0-4
        var fName = faker.name.firstName();
        var lName = faker.name.lastName();

        var tempReview = {
            username: '',
            rating: 0,
            comment: '',
            timeStamp: ''
        };
    
        var tempPro = {
            username: faker.internet.userName(fName, lName),
            hash: bcrypt.hashSync(faker.internet.password(10, true), 10),
            firstName: fName,
            lastName: lName,
            dateCreated: faker.date.past(3),
            bsb: faker.random.number(options),
            accountNumber: faker.finance.account(9),
            reviews: []
        };

        for (let i = 0; i < numOfReviews; i++) {
            var tmpMember = faker.random.arrayElement(memberArray);
            tempReview.username = tmpMember.username;
            tempReview.rating = faker.random.number(5);
            tempReview.comment = faker.lorem.sentence();
            
            if (tempPro.dateCreated < tmpMember.dateCreated) {
                tempReview.timeStamp = faker.date.between(tempPro.dateCreated, tmpMember.dateCreated);
            } else if (tmpMember.dateCreated < tempPro.dateCreated) {
                tempReview.timeStamp = faker.date.between(tmpMember.dateCreated, tempPro.dateCreated);
            }

            tempPro.reviews.push(tempReview);
        }

        var professional = new Professional(tempPro);
        proArray.push(professional);
    }

    Professional.insertMany(proArray).then(function() {
        console.log('Professionals committed to database.');
    })
    .catch(function(err) {
       console.log(err);
    });
}

// Create 1000 requests
function createTestRequests() {
    
    // Array of potential problems 
    var problemArray = ['Flat tyre', 'Flat battery', "Won't start (has fuel)", 'Out of fuel', 'Locked out', 'Towing'];

    // Array of potential manufacturers
    var maufacturerArray = ["Chevrolet", "Cadillac", "Ford", "Chrysler", "Dodge", "Jeep", "Tesla", "Toyota", "Honda", "Nissan", "Audi", "Mercedes Benz", "BMW", 
    "Volkswagen", "Porsche", "Jaguar", "Aston Martin", "Land Rover", "Bentley", "Mini", "Rolls Royce", "Fiat", "Lamborghini", "Maserati", "Ferrari", "Bugatti", "Kia", "Hyandai"];

    // Array of potential models
    var modelArray = ["Fiesta", "Focus", "Taurus", "Mustang", "Explorer", "Expedition", "F-150", "Model T", "Ranchero", "Volt", "Cruze", "Malibu", "Impala", "Camaro", "Corvette", "Colorado",
    "Silverado", "El Camino", "CTS", "XTS", "ATS", "Escalade", "Alpine", "Charger", "LeBaron", "PT Cruiser", "Challenger", "Durango", "Grand Caravan", "Wrangler", "Grand Cherokee", "Roadster",
    "Model S", "Model 3", "Camry", "Prius", "Land Cruiser", "Accord", "Civic", "Element", "Sentra", "Altima", "A8", "A4", "Beetle", "Jetta", "Golf", "911", "Spyder", "Countach", "Mercielago", "Aventador",];

    for (let index = 0; index < 1000; index++) {

        var requestMem = faker.random.arrayElement(memberArray);
        var numOfResponders = Math.floor(Math.random() * 5) + 1;

        var tmpRequest = {
            memberID: requestMem._id,
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            problemType: faker.random.arrayElement(problemArray),
            model: faker.random.arrayElement(maufacturerArray) + ' ' + faker.random.arrayElement(modelArray),
            colour: faker.commerce.color(),
            plateNumber: faker.random.alphaNumeric(6),
            responders: [],
            status: 'completed'
        };

        var tmpTransaction = {
            sender: '',
            receiver: '',
            amount: 0,
            for: 'service',
            timeStamp: ''
        };

        var arrayOfTempPros = new Map();
        var lastPro = null;
        for (let n = 0; n < numOfResponders; n++) {
            var tmPro = faker.random.arrayElement(proArray);
            var tmpResponder = {
                responderID: tmPro._id,
            }

            if (requestMem.membershipType == 'Per-service') {
                tmpResponder.quote = faker.finance.amount(40, 500);
                arrayOfTempPros.set(tmpResponder.quote, tmPro);
            }

            tmpRequest.responders.push(tmpResponder);
            lastPro = tmPro;
        }

        var request = null;
        if (requestMem.membershipType == 'Per-service') {
            var res = faker.random.arrayElement(tmpRequest.responders);
            tmpRequest.amount = res.quote;
            request = new Request(tmpRequest);

            tmpTransaction.amount = roundToTwoDecimal(tmpRequest.amount * 0.88);
            
            var selectedPro = arrayOfTempPros.get(tmpRequest.amount);
            tmpTransaction.sender = requestMem.username;
            tmpTransaction.receiver = selectedPro.username;
            tmpTransaction.requestID = request._id;
            createTestTransaction2(requestMem, selectedPro, tmpTransaction); // For the professional

            tmpTransaction.amount = roundToTwoDecimal(tmpRequest.amount * 0.12);
            tmpTransaction.sender = selectedPro.username;
            tmpTransaction.receiver = 'roadside-assistant';
            createTestTransaction2(selectedPro, 'roadside-assistant', tmpTransaction); // For the companys cut
        } else {
            request = new Request(tmpRequest);
            tmpTransaction.amount = 50;
            tmpTransaction.sender = 'roadside-assistant';
            tmpTransaction.receiver = lastPro.username;
            createTestTransaction2('roadside-assistant', lastPro, tmpTransaction);
        }
        requestArray.push(request);
    }

    Request.insertMany(requestArray).then(function() {
        console.log('Requests committed to database.');
    })
    .catch(function(err) {
       console.log(err);
    });
}

// Create a transaction object (for membership subscriptions)
function createTestTransaction(sender, transactionObj) {
    var to = new Date(2019, 6, 3, 0, 0, 0, 0);
    transactionObj.timeStamp = faker.date.between(sender.dateCreated, to);

    var transaction = new Transaction(transactionObj);
    transactionArray.push(transaction);
}

// Create a transaction object (for service request transactions)
function createTestTransaction2(sender, receiver, transactionObj) {
    var to = new Date(2019, 6, 3, 0, 0, 0, 0);

    if (receiver == 'roadside-assistant') {
        transactionObj.timeStamp = faker.date.between(sender.dateCreated, to);
    } else {
        if (sender.dateCreated < receiver.dateCreated) {
            transactionObj.timeStamp = faker.date.between(sender.dateCreated, receiver.dateCreated);
        } else if (receiver.dateCreated < sender.dateCreated) {
            transactionObj.timeStamp = faker.date.between(receiver.dateCreated, sender.dateCreated);
        }
    }

    if (sender == 'roadside-assistant') {
        transactionObj.timeStamp = faker.date.between(receiver.dateCreated, to);
    }

    var transaction = new Transaction(transactionObj);
    transactionArray.push(transaction);
}

// Round down a number to two decimal places
function roundToTwoDecimal (num){
    var num_sign = num >= 0 ? 1 : -1;
    num = (Math.round((num*Math.pow(10,2))+(num_sign*0.0001))/Math.pow(10,2)).toFixed(2);
    return num;
}