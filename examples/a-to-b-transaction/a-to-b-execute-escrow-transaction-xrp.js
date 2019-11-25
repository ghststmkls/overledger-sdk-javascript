// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('../../packages/overledger-bundle/dist').default;
const TransactionTypes = require('../../packages/overledger-dlt-ripple/dist/Ripple').TransactionTypes;
const DltNames = require('../../packages/overledger-dlt-abstract/dist/AbstractDLT').DltNames;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

//The following are found from your Overledger Account:
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// This example, shows how to execute an escrow on XRP between two parties A and B.
// It is assumed that you have previously created an escrow and it is not currently expired.
//
// Paste in the two parties XRP addresses (also known as account) and party B's private key.
// Therefore we are suggesting that in this example, party B is executing the escrow. Note that any party of the escrow can execute it, we have just choosen party B for this example.
// Note that to generate XRP test accounts, you can go to the official Ripple Testnet Faucet to get a prefunded one.

// Party A's details are as follows:
const partyARippleAddress = '<ENTER YOUR XRP PARTY A ADDRESS>';

// Party B's details are as follows:
const partyBRippleAddress = '<ENTER YOUR XRP PARTY B ADDRESS>';
const partyBRipplePrivateKey = '<ENTER YOUR XRP PARTY B PRIVATE KEY>';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    //connect to overledger and choose the XRP distributed ledger:
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNames.xrp }],
      provider: { network: 'testnet' },
    });

    //You can add a message that will be encorporated into the transaction (this is additional to the escrow functionality):
    const transactionMessage = 'Overledger JavaScript SDK Escrow Execution Test';

    // SET party B's corresponding private key that will be used for signing messages from his account;
    overledger.dlts.ripple.setAccount(partyBRipplePrivateKey);

    // Get party A's account sequences. XRP requires transactions to be sent from an account in seqeunce order, overledger finds the next correct sequence number
    const rippleSequenceRequest = await overledger.dlts.ripple.getSequence(partyBRippleAddress);
    const rippleAccountSequence = rippleSequenceRequest.data.dltData[0].sequence;

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
    {
      // In order to prepare an XRP transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: DltNames.xrp, //which DLT to use
      toAddress: partyARippleAddress, //which address/account this message is being sent to
      message: transactionMessage, //any message you want to write
      options: {
        amount: '1', // The amount of Drops you want to send. Minimum send is 1 drop. 1 drop = 0.000001 XRP.
        sequence: rippleAccountSequence, //Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet. As previously discussed OVL finds the correct sequence.
        //feePrice: '', // FeePrice is denoted in drops. The escrow execution fee of a transaction is dynamic and depends on the size of the hash time lock fulfillment. Leave this empty for the minimum fee to be calculated.
        maxLedgerVersion: '4294967295', //The maximum ledger version the transaction can be included in.
        transactionType: TransactionTypes.escrowExecution, //we are now performing an escrowExecution transaction so it should be selected here.
        atomicSwapParameters: {
          owner: partyARippleAddress, //Who created the escrow
          escrowSequence: '40', //The sequence number of the escrow creation transaction. This can be either found from the transaction search using Overledger's search package or from a testnet explorer online
          hashAlgorithmInput: 'Test' //This is the hash algorithm input. In the escrowExecution transaction type, this will now be written onto the XRP ledger so that the escrow is executed.
        }
      },
    },]);

     // The signed transaction can now be sent to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();