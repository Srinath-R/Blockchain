const SHA256=require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress,toAddress,amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block
{
    constructor(/*index,*/timestamp,transactions,previousHash=' ')
    {
        /*this.index=index;*/
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }

    calculateHash()
    {
        return SHA256(/*this.index+*/this.previousHash+this.timestamp+JSON.stringify(this.transactions)+this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        while (this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0"))
        {
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined: "+this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain=[this.createGenesisBlock()];
        this.difficulty=5;
        this.pendingTransactions=[];
        this.miningReward=100;
    }

    createGenesisBlock()
    {
        return new Block(/*0,*/"28/05/2019","Genesis block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress)
    {
        let block=new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions=[new Transaction(null,miningRewardAddress,this.miningReward)];
    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance=0;

        for (const block of this.chain)
        {
            for (const trans of block.transactions)
            {
                if (trans.fromAddress===address)
                {
                    balance-=trans.amount;
                }

                if (trans.toAddress===address)
                {
                    balance+=trans.amount;
                }
            }
        }

        return balance;
    }

    addBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);//newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid()
    {
        for (let i = 1; i < this.chain.length; i++)
        {
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];

            if(currentBlock.hash!==currentBlock.calculateHash())
            {return false;}

            if (currentBlock.previousHash!==previousBlock.hash)
            {return false;}
        }
        return true;
    }
}

let blockchain=new Blockchain();
/*
console.log('Mining block 1...');
blockchain.addBlock(new Block(1,"28/05/2019",{amount:7}));
console.log('Mining block 2...');
blockchain.addBlock(new Block(2,"28/05/2019",{amount:5}));

console.log(JSON.stringify(blockchain,null,4));
console.log('Is blockchain valid?'+blockchain.isChainValid());
*/
blockchain.createTransaction(new Transaction('address1','address2',100));
blockchain.createTransaction(new Transaction('address2','address1',50));

console.log('Starting the miner...');
blockchain.minePendingTransactions('srinath-address');

console.log('\nBalance of srinath is',blockchain.getBalanceOfAddress('srinath-address'));

console.log('Starting the miner again...');
blockchain.minePendingTransactions('srinath-address');

console.log('\nBalance of srinath is',blockchain.getBalanceOfAddress('srinath-address'));
