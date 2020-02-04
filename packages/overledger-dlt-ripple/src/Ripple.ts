import { RippleAPI } from 'ripple-lib';
import { dropsToXrp } from 'ripple-lib/dist/npm/common';
import { deriveKeypair, deriveAddress } from 'ripple-keypairs';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Account, Options, TransactionRequest } from '@quantnetwork/overledger-types';
import { Payment } from 'ripple-lib/dist/npm/transaction/payment';
import { Instructions } from 'ripple-lib/dist/npm/transaction/types';
import TransactionXRPRequest from './DLTSpecificTypes/TransactionXRPRequest';

/**
 * @memberof module:overledger-dlt-ripple
*/
class Ripple extends AbstractDLT {
  rippleAPI: RippleAPI;
  account: Account;
  options: Object;
  /**
   * Name of the DLT
   */
  name: string = 'ripple';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'XRP';

  /**
   * @param {any} sdk
   * @param {Object} options
   */
  // @TODO: add options statement
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.options = options;

    this.rippleAPI = new RippleAPI();

    if (options.privateKey) {
      this.setAccount(options.privateKey);
    }
  }

  /**
   * Create an account for a specific DLT
   *
   * @return {Account}
   */
  createAccount(): Account {
    const generated = this.rippleAPI.generateAddress();

    const account = {
      address: generated.address,
      privateKey: generated.secret,
    };

    return account;
  }

  /**
   * Set an account for signing for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(privateKey: string): void {
    const keypair = deriveKeypair(privateKey);
    const account = {
      privateKey,
      address: keypair.publicKey,
    };
    account.address = deriveAddress(keypair.publicKey);
    this.account = account;
  }

  /**
   * Takes the Overledger definition of a transaction and converts it into a specific XRP transaction
   * @param {TransactionXRPRequest} thisTransaction - details on the information to include in this transaction for the XRP distributed ledger
   * @return {Transaction} the XRP transaction
   */
  buildTransaction(thisTransaction: TransactionXRPRequest): Transaction {
    if (typeof thisTransaction.extraFields === 'undefined') {   
      throw new Error('Transaction options must be defined.');
    }

    if (typeof thisTransaction.amount === 'undefined') {
      throw new Error('A transaction.amount must be given');
    }

    if (typeof thisTransaction.extraFields.feePrice === 'undefined') {
      throw new Error('A transaction.extraFields.feePrice must be given');
    }

    if (typeof thisTransaction.sequence === 'undefined') {
      throw new Error('A transaction.sequence must be given');
    }

    if (typeof thisTransaction.extraFields.maxLedgerVersion === 'undefined') {
      throw new Error('A transactions.extraFields.maxLedgerVersion must be set up');
    }
    const maxLedgerVersion = Number(thisTransaction.extraFields.maxLedgerVersion);
    const amountInXRP = dropsToXrp(thisTransaction.amount.toString());
    const feeInXRP = dropsToXrp(thisTransaction.extraFields.feePrice);

    const address = this.account.address;
    const payment = {
      source: {
        address: this.account.address,
        amount: {
          value: amountInXRP,
          currency: 'XRP',
        },
      },
      destination: {
        address: thisTransaction.toAddress,
        minAmount: {
          value: amountInXRP,
          currency: 'XRP',
        },
      },
      memos: [{
        data: thisTransaction.message,
      }],
    };
    const instructions = {
      maxLedgerVersion,
      sequence: thisTransaction.sequence,
      fee: feeInXRP,
    };

    return { address, payment, instructions };
  }

  /**
   * Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an XRP transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {
    
    //now input validation on an XRP transaction
    let thisXRPTx = <TransactionXRPRequest> thisTransaction;
    if ((thisXRPTx.extraFields.feePrice == "")||(thisXRPTx.extraFields.feePrice == null)||(thisXRPTx.extraFields.feePrice === 'undefined')){
      throw new Error(`All transactions for XRP must have the extraFields.feePrice field set`);      
    } else if ((thisXRPTx.extraFields.maxLedgerVersion == "")||(thisXRPTx.extraFields.maxLedgerVersion == null)||(thisXRPTx.extraFields.maxLedgerVersion === 'undefined')){
      throw new Error(`All transactions for XRP must have the extraFields.maxLedgerVersion field set`);      
    }

    const built = this.buildTransaction(thisXRPTx);

    return this.rippleAPI.preparePayment(built.address, built.payment, built.instructions)
      .then(
        prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
      );
  }

  /**
   * Allows a user to build a smart contract query for the XRP distributed ledger (currently not supported for XRP)
   * @param {string} dltAddress - the user's XRP address
   * @param {Object} contractQueryDetails - the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call.
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): Object {

    return {success: false, response: dltAddress.toString() + contractQueryDetails.toString()};
  }

}


export type Transaction = {
  address: string,
  payment: Payment,
  instructions?: Instructions,
};



export default Ripple;
