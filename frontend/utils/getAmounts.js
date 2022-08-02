import { Contract } from 'ethers';
import {
	TOKEN_CONTRACT_ABI,
	TOKEN_CONTRACT_ADDRESS,
	EXCHANGE_CONTRACT_ABI,
	EXCHANGE_CONTRACT_ADDRESS,
} from '../constants';

//function retrieves ETH balance of the user of the contract

export const getEtherBalance = async (provider, address, contract = false) => {
	try {
		//if the user has boolean contract set to true, retreive the balance of the exchange contract, if not just his balance
		if (contract) {
			const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
			return balance;
		} else {
			const balance = await provider.getBalance(address);
			return balance;
		}
	} catch (err) {
		console.error(ett);
		return 0;
	}
};

//function gets CD tokens balance of the user
export const getCDTokensBalance = async (provider, address) => {
	try {
		const tokenContract = new Contract(
			TOKEN_CONTRACT_ADDRESS,
			TOKEN_CONTRACT_ABI,
			provider
		);
		const balanceOfCDTokens = await tokenContract.balanceOf(address);
		return balanceOfCDTokens;
	} catch (err) {
		console.error(err);
		return 0;
	}
};

//get LP tokens in the account of the address
export const getLPTokensBalance = async (provider, address) => {
	try {
		const exchangeContract = new Contract(
			EXCHANGE_CONTRACT_ADDRESS,
			EXCHANGE_CONTRACT_ABI,
			provider
		);
		const balanceOfLPTokens = await exchangeContract.balanceOf(address);
		return balanceOfLPTokens;
	} catch (err) {
		console.error(err);
		return 0;
	}
};

//function gets reserve of CD tokens
export const getReserveOfCDTokens = async (provider) => {
	try {
		const exchangeContract = new Contract(
			EXCHANGE_CONTRACT_ADDRESS,
			EXCHANGE_CONTRACT_ABI,
			provider
		);
		console.log('#####: Exchange Contract ', exchangeContract);
		const reserve = await exchangeContract.getReserve();
		return reserve;
	} catch (err) {
		console.error(err);
		return 0;
	}
};
