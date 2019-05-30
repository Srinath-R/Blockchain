const { Blockchain, Transaction } =  require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const blockchain = new Blockchain();

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 10);
tx1.signTransaction(myKey);
blockchain.addTransaction(tx1);

/*
console.log('Mining block 1...');
blockchain.addBlock(new Block(1,"28/05/2019",{amount:7}));
console.log('Mining block 2...');
blockchain.addBlock(new Block(2,"28/05/2019",{amount:5}));

console.log(JSON.stringify(blockchain,null,4));
console.log('Is blockchain valid?'+blockchain.isChainValid());
*/
// blockchain.createTransaction(new Transaction('address1','address2',100));
// blockchain.createTransaction(new Transaction('address2','address1',50));

// Mine block
blockchain.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
blockchain.addTransaction(tx2);

// Mine block
blockchain.minePendingTransactions(myWalletAddress);

console.log();
console.log('Balance of srinath is ${blockchain.getBalanceOfAddress(myWalletAddress)}');

// Uncomment this line if you want to test tampering with the chain
// blockchain.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', blockchain.isChainValid() ? 'Yes' : 'No');
