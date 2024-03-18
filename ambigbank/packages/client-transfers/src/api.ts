/* tslint:disable */
/* eslint-disable */
/**
 * AM BigBank Transfers Microservice API
 * The BigBank Transfers Microservice API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface CreateTransferDto
 */
export interface CreateTransferDto {
    /**
     * 
     * @type {string}
     * @memberof CreateTransferDto
     */
    'senderId': string;
    /**
     * 
     * @type {string}
     * @memberof CreateTransferDto
     */
    'receiverId': string;
    /**
     * 
     * @type {string}
     * @memberof CreateTransferDto
     */
    'amount': string;
    /**
     * 
     * @type {string}
     * @memberof CreateTransferDto
     */
    'userId': string;
}
/**
 * 
 * @export
 * @interface TransferDto
 */
export interface TransferDto {
    /**
     * 
     * @type {string}
     * @memberof TransferDto
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof TransferDto
     */
    'senderId': string;
    /**
     * 
     * @type {string}
     * @memberof TransferDto
     */
    'receiverId': string;
    /**
     * 
     * @type {object}
     * @memberof TransferDto
     */
    'amount': object;
}

/**
 * TransfersApi - axios parameter creator
 * @export
 */
export const TransfersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create transfer
         * @param {CreateTransferDto} createTransferDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        transfersControllerCreateTransfer: async (createTransferDto: CreateTransferDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createTransferDto' is not null or undefined
            assertParamExists('transfersControllerCreateTransfer', 'createTransferDto', createTransferDto)
            const localVarPath = `/transfers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createTransferDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary List transfers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        transfersControllerListTransfers: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/transfers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TransfersApi - functional programming interface
 * @export
 */
export const TransfersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TransfersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Create transfer
         * @param {CreateTransferDto} createTransferDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async transfersControllerCreateTransfer(createTransferDto: CreateTransferDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TransferDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.transfersControllerCreateTransfer(createTransferDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TransfersApi.transfersControllerCreateTransfer']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary List transfers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async transfersControllerListTransfers(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TransferDto>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.transfersControllerListTransfers(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TransfersApi.transfersControllerListTransfers']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * TransfersApi - factory interface
 * @export
 */
export const TransfersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TransfersApiFp(configuration)
    return {
        /**
         * 
         * @summary Create transfer
         * @param {CreateTransferDto} createTransferDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        transfersControllerCreateTransfer(createTransferDto: CreateTransferDto, options?: any): AxiosPromise<TransferDto> {
            return localVarFp.transfersControllerCreateTransfer(createTransferDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary List transfers
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        transfersControllerListTransfers(options?: any): AxiosPromise<Array<TransferDto>> {
            return localVarFp.transfersControllerListTransfers(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TransfersApi - object-oriented interface
 * @export
 * @class TransfersApi
 * @extends {BaseAPI}
 */
export class TransfersApi extends BaseAPI {
    /**
     * 
     * @summary Create transfer
     * @param {CreateTransferDto} createTransferDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TransfersApi
     */
    public transfersControllerCreateTransfer(createTransferDto: CreateTransferDto, options?: RawAxiosRequestConfig) {
        return TransfersApiFp(this.configuration).transfersControllerCreateTransfer(createTransferDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary List transfers
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TransfersApi
     */
    public transfersControllerListTransfers(options?: RawAxiosRequestConfig) {
        return TransfersApiFp(this.configuration).transfersControllerListTransfers(options).then((request) => request(this.axios, this.basePath));
    }
}



