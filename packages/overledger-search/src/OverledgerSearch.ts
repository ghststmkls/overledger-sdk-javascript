import { AxiosInstance, AxiosPromise } from 'axios';
import { TypeOptions, BytesMOptions, UintIntMOptions, computeParamType } from '@quantnetwork/overledger-types';

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
   * Get transaction by transaction hash (non-deterministic)
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

  queryContract(dlt: string, fromAddress: string, contractAddress: string, functionName: string, inputValues: [ReadSmartContractInputValue], outputTypes: [ReadSmartContractOutputType]): AxiosPromise {
    console.log(`input values `, inputValues);
    console.log(`outputTypes `, outputTypes);
    try {
      const data = {
        fromAddress,
        contractAddress,
        funcName: functionName,
        inputValues: this.computeInputValuesList(inputValues),
        outputTypes: this.computeOutputTypesList(outputTypes)
      }
      console.log(`data`, data);
      return this.request.post(`/${dlt}/contracts/query/`, JSON.stringify(data));
    } catch (e) {
      return e.response;
    }
  }

  computeInputValuesList(inputFunctionParams: [ReadSmartContractInputValue]) {
    const inputValues = inputFunctionParams.reduce((inputParams, p) => {
      const paramType = computeParamType(p);
      inputParams.push(<ContractInputArgument>{type: paramType, value: p.value});
      return inputParams;
    }, []);
    console.log(`input values `, inputValues);
    return inputValues;
  }

  computeOutputTypesList(outputFunctionTypes: [ReadSmartContractOutputType]) {
    const outputTypes = outputFunctionTypes.reduce((outputTypes, p) => {
      const paramType = computeParamType(p);
      outputTypes.push(<ContractTypeOutput>{type: paramType});
      return outputTypes;
    }, []);
    console.log(`output values `, outputTypes);
    return outputTypes;
  }

}

export interface IContractQueryRequestDto {
  fromAddress: string;
  contractAddress: string;
  funcName: string;
  inputValues?: [ContractInputArgument];
  outputTypes?: [ContractTypeOutput];
}

export interface ReadSmartContractInputValue {
  type: TypeOptions;
  uintIntMValue?: UintIntMOptions;
  bytesMValue?: BytesMOptions;
  value: string;
}

export interface ReadSmartContractOutputType {
  type: TypeOptions;
  uintIntMValue: UintIntMOptions;
  bytesMValue?: BytesMOptions;
}

interface ContractInputArgument {
  type: string;
  value: string;
}

interface ContractTypeOutput {
  type: string;
}

export default OverledgerSearch;
