const OverledgerSDK = require("../../packages/bundle").default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// FROM THE OUTPUT OF SCRIPT '1-partyA.js';
const partyABitcoinPrivateKey = 'cSNgxoDKt65wBc96m5ugRkoVaBVQLTCodd1jtDuJrhWDYFuBvruq';
const partyAEthereumPrivateKey = '0x2ad787fc919c8c974c59b3ee57bc253a2ae8b5e53ffb11b67f712049f69fcfb9';
const partyARipplePrivateKey = 'sst5TpEdQMkfXmNc6xAS4JpRN9Ezc';

const bitcoinFaucetMessageTxnHash = '010ff9bca3ed8f9b03d4f96979b6bfd6d383dba2958b4aebf3921d1de8dac811';
const bitcoinFaucetMessageAmount = 100000000;

// FROM THE OUTPUT OF SCRIPT '1-partyB.js';
const partyBBitcoinAddress = 'mtnuMGfkimA7LoPZ8QXcncYPYSByQJBBxM';
const partyBEthereumAddress = '0x8661C6a3A44862498aB944C921858A5faDa931A7';
const partyBRippleAddress = 'rJR7t9RDQupG5BbHramSKVcQH6jfpNdrxK';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: "bitcoin" }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
        });

        const transactionMessage = 'SDK test';

        // SET partyA ACCOUNTS FOR SIGNING;
        overledger.dlts.bitcoin.setAccount(partyABitcoinPrivateKey);
        overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
        overledger.dlts.ripple.setAccount(partyARipplePrivateKey);

        const signedTransaction = await overledger.sign([
            {
                dlt: 'bitcoin',
                toAddress: partyBBitcoinAddress,
                message: transactionMessage,
                options: {
                    amount: 546, // Minimum allowed amount of satoshi
                    sequence: 0, //Bitcoin Faucet Message Vout, from when funding the address
                    // TODO: This fee price is required when you put the output of the transaction
                    feePrice: 100000, // is this fee price set? Should an endpoint be called beforehand? How is it calculated?
                    previousTransactionHash: bitcoinFaucetMessageTxnHash,
                    value: bitcoinFaucetMessageAmount, // This value is used to calculate the output amount
                }
            },
            {
                dlt: 'ethereum',
                toAddress: partyBEthereumAddress,
                message: transactionMessage,
                options: {
                    amount: 0, // On Ethereum you can send 0 amount transactions. But you still pay network fees
                    sequence: 0, // Sequence starts at 0 after funding
                    feePrice: 21000, // This is the minimum fee price in Ethereum
                    feeLimit: 2100000, // The maximum fee that this transaction can use (can be set by the user)
                }
            },
            {
                dlt: 'ripple',
                toAddress: partyBRippleAddress,
                message: transactionMessage,
                options: {
                    amount: '1', // Minimum allowed amount of drops
                    sequence: 1, // Sequence increases by 1 with each transaction
                    feePrice: '0.000012', // Minimum feePrice on Ripple
                    maxLedgerVersion: 4294967295, // The maximum ledger version the transaction can be included in.
                }
            }
        ]);


        const result = (await overledger.send(signedTransaction)).data;
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('error', e.response.data);
    }
})();