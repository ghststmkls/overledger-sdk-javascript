import { AxiosInstance, AxiosPromise } from 'axios';

/**
 * @memberof module:overledger-search
 */
class OverledgerSearch {
  sdk: any;
  request: AxiosInstance;

  /**
   * @param {Object} sdk
   */
  constructor(sdk: any) {
    this.sdk = sdk;
    this.request = this.sdk.provider.createRequest('/search');
  }

  /**
   * Get transaction by transaction hash
   *
   * @param {string} transactionHash Transaction hash
   */
  getTransaction(transactionHash: string): AxiosPromise {
    try {
      return this.request.get(`/transactions/${transactionHash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get the transaction type based on the hash
   *
   * @param {string} hash hash
   */
  getTransactionType(hash: string): AxiosPromise {
    try {
      return this.request.get(`/whoami/${hash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block by DLT and number
   *
   * @param {string} dlt The DLT name
   * @param {number} blockNumber The block number
   */
  getBlockByDltAndNumber(dlt: string, blockNumber: number): AxiosPromise {
    try {
      return this.request.get(`/${dlt}/blocks/${blockNumber}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block by DLT and number
   *
   * @param {string} dlt The DLT name
   */
  getBlockHeightByDlt(dlt: string): AxiosPromise {
    try {
      return this.request.get(`/${dlt}/block/height`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block by DLT and hash
   *
   * @param {string} dlt The DLT name
   * @param {string} hash The block hash
   */
  getBlockByDltAndHash(dlt: string, hash: string): AxiosPromise {
    try {
      return this.request.get(`/${dlt}/blocks/${hash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Query a smart contract
   * @param dlt - the distributed ledger that this smart contract is on
   * @param contractQueryDetails - details on this smart contract query
   */
  smartContractQuery(dlt: string, contractQueryDetails: Object): AxiosPromise {
    try {
      console.log(`contractQueryDetails ${JSON.stringify(contractQueryDetails)}`);
      return this.request.post(`/${dlt}/contracts/query/`, JSON.stringify(contractQueryDetails));
    } catch (e) {
      return e.response;
    }
  }

}
export default OverledgerSearch;
