import { Contract, providers, utils, BigNumber } from 'ethers';
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from '../constants';

export const removeLiquidity = async (signer, removeLPTokensWei) => {
	const exchangeContract = new Contract(
		EXCHANGE_CONTRACT_ADDRESS,
		EXCHANGE_CONTRACT_ABI,
		signer
	);
	const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
	await tx.wait();
};

//function calculates new amounts of CD and ETH in the contract after removal of the liquidity
export const getTokensAfterRemove = async (
	provider,
	removeLPTokensWei,
	_ethBalance,
	cryptoDevTokenReserve
) => {
	try {
		const exchangeContract = new Contract(
			EXCHANGE_CONTRACT_ADDRESS,
			EXCHANGE_CONTRACT_ABI,
			provider
		);

		//get the total supply of LP tokens
		const _totalSupply = await exchangeContract._totalSupply();

		//both ETH nd CD amounts which will be removed are based on the share of Liquidity tokens the user has in total liquitity tokens balance
		const _removeEther = _ethBalance.mul(removeLPTokensWei).div(_totalSupply);
		const _removeCD = cryptoDevTokenReserve
			.mul(removeLPTokensWei)
			.div(_totalSupply);
		return {
			_removeEther,
			_removeCD,
		};
	} catch (err) {
		console.error(err);
	}
};
