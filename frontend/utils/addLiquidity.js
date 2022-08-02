import { Contract, utils } from 'ethers';
import {
	TOKEN_CONTRACT_ABI,
	TOKEN_CONTRACT_ADDRESS,
	EXCHANGE_CONTRACT_ABI,
	EXCHANGE_CONTRACT_ADDRESS,
} from '../constants';

//user adds ETH and CD tokens in the proportion equal to reserves already existing in the contract
//if there is nothing in the contract, then he adds arbitratrary proportion, the one he desides

export const addLiquidity = async (
	signer,
	addCDAmountWei,
	addEtherAmountWei
) => {
	try {
		const tokenContract = new Contract(
			TOKEN_CONTRACT_ADDRESS,
			TOKEN_CONTRACT_ABI,
			signer
		);

		const exchangeContract = new Contract(
			EXCHANGE_CONTRACT_ADDRESS,
			EXCHANGE_CONTRACT_ABI,
			signer
		);

		//user needs to give Exchange contract to take CD tokens from his account in CD
		let tx = await tokenContract.approve(
			EXCHANGE_CONTRACT_ADDRESS,
			addCDAmountWei.toString()
		);
		await tx.wait();

		//add liquidity
		tx = await exchangeContract.addLiquidity(addCDAmountWei, {
			value: addEtherAmountWei,
		});
		await tx.wait();
	} catch (err) {
		console.error(err);
	}
};

//function calculates how many CD tokens should be added to maintain proportion in the contract
export const calculateCD = async (
	_addEther = '0',
	etherBalanceContract,
	cdTokenReserve
) => {
	//_addEther is a string, we need to convert it into Big Number
	const _addEtherAmountWei = utils.parseEther(_addEther);

	const cryptoDevTokenAmount = _addEtherAmountWei
		.mul(cdTokenReserve)
		.div(etherBalanceContract);
	return cryptoDevTokenAmount;
};
