[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript

# @overledger/search

Class encompassing [Overledger SDK][repo] search functions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @overledger/search
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @overledger/search
```

## API Reference

<a name="module_search"></a>

## search

* [search](#module_search)

    * _static_
        * [.default](#module_search.default)

    * _inner_
        * [~OverledgerSearch](#module_search.OverledgerSearch)

            * [new OverledgerSearch(sdk)](#new_module_search.OverledgerSearch_new)

            * [.getTransaction(transactionHash)](#module_search.OverledgerSearch+getTransaction)

            * [.getTransactionType(hash)](#module_search.OverledgerSearch+getTransactionType)

            * [.getBlockByDltAndNumber(dlt, blockNumber)](#module_search.OverledgerSearch+getBlockByDltAndNumber)

            * [.getBlockByDltAndHash(dlt, hash)](#module_search.OverledgerSearch+getBlockByDltAndHash)


<a name="module_search.default"></a>

### *search*.default
Search support package.

<a name="module_search.OverledgerSearch"></a>

### *search*~OverledgerSearch

* [~OverledgerSearch](#module_search.OverledgerSearch)

    * [new OverledgerSearch(sdk)](#new_module_search.OverledgerSearch_new)

    * [.getTransaction(transactionHash)](#module_search.OverledgerSearch+getTransaction)

    * [.getTransactionType(hash)](#module_search.OverledgerSearch+getTransactionType)

    * [.getBlockByDltAndNumber(dlt, blockNumber)](#module_search.OverledgerSearch+getBlockByDltAndNumber)

    * [.getBlockByDltAndHash(dlt, hash)](#module_search.OverledgerSearch+getBlockByDltAndHash)


<a name="new_module_search.OverledgerSearch_new"></a>

#### new OverledgerSearch(sdk)

| Param | Type |
| --- | --- |
| sdk | <code>Object</code> | 

<a name="module_search.OverledgerSearch+getTransaction"></a>

#### *overledgerSearch*.getTransaction(transactionHash)

| Param | Type | Description |
| --- | --- | --- |
| transactionHash | <code>string</code> | Transaction hash |

Get transaction by transaction hash (non-deterministic)

<a name="module_search.OverledgerSearch+getTransactionType"></a>

#### *overledgerSearch*.getTransactionType(hash)

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | hash |

Get the transaction type based on the hash

<a name="module_search.OverledgerSearch+getBlockByDltAndNumber"></a>

#### *overledgerSearch*.getBlockByDltAndNumber(dlt, blockNumber)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| blockNumber | <code>number</code> | The block number |

Get block by DLT and number

<a name="module_search.OverledgerSearch+getBlockByDltAndHash"></a>

#### *overledgerSearch*.getBlockByDltAndHash(dlt, hash)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| hash | <code>string</code> | The block hash |

Get block by DLT and hash
