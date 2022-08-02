import { Contract } from 'ethers';
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from '../constants';
import {
	TOKEN_CONTRACT_ABI,
	TOKEN_CONTRACT_ADDRESS,
} from '../constants/index.mjs';

export const getAmountOfTokensReceivedFromSwap = async (
	_swaptAmountWei,
	provider,
	ethSelected,
	ethBalance,
	reserveCD
) => {
	const exchangeContract = new Contract(
		EXCHANGE_CONTRACT_ADDRESS,
		EXCHANGE_CONTRACT_ABI,
		provider
	);
	let amountOfTokens;

	if (ethSelected) {
		amountOfTokens = await exchangeContract.getAmountOfTokens(
			_swaptAmountWei,
			ethBalance,
			reserveCD
		);
	} else {
		amountOfTokens = await exchangeContract.getAmountOfTokens(
			_swaptAmountWei,
			reserveCD,
			ethBalance
		);
	}

	return amountOfTokens;
};

export const swapTokens = async (
	signer,
	swapAmountWei,
	tokenToBeReceivedAfterSwap,
	ethSelected
) => {
	const exchangeContract = new Contract(
		EXCHANGE_CONTRACT_ADDRESS,
		EXCHANGE_CONTRACT_ABI,
		signer
	);

	const tokenContract = new Contract(
		TOKEN_CONTRACT_ADDRESS,
		TOKEN_CONTRACT_ABI,
		signer
	);

	let tx;

	if (ethSelected) {
		tx = await exchangeContract.ethToCryptoDevToken(
			tokenToBeReceivedAfterSwap,
			{
				value: swapAmountWei,
			}
		);
	} else {
		tx = await tokenContract.approve(
			EXCHANGE_CONTRACT_ADDRESS,
			swapAmountWei.toString()
		);
		await tx.wait();

		tx = await exchangeContract.cryptoDevTokenToEth(
			swapAmountWei,
			tokenToBeReceivedAfterSwap
		);
	}

	await tx.wait();
};
