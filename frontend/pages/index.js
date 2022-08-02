import { BigNumber, providers, utils } from 'ethers';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import styles from '../styles/Home.module.css';
import { addLiquidity, calculateCD } from '../utils/addLiquidity';
import {
	getCDTokensBalance,
	getEtherBalance,
	getLPTokenBalance,
	getReserveOfCDTokens,
} from '../utils/getAmounts';
import {
	getTokensAfterRemove,
	removeLiquidity,
} from '../utils/removeLiquidity';
import { swapTokens, getAmountOfTokensReceivedFromSwap } from '../utils/swap';

export default function Home() {
	/** General state variables */
	// loading is set to true when the transaction is mining and set to false when
	// the transaction has mined
	const [loading, setLoading] = useState(false);
	// We have two tabs in this dapp, Liquidity Tab and Swap Tab. This variable
	// keeps track of which Tab the user is on. If it is set to true this means
	// that the user is on `liquidity` tab else he is on `swap` tab
	const [liquidityTab, setLiquidityTab] = useState(true);
	// This variable is the `0` number in form of a BigNumber
	const zero = BigNumber.from(0);
	/** Variables to keep track of amount */
	// `ethBalance` keeps track of the amount of Eth held by the user's account
	const [ethBalance, setEtherBalance] = useState(zero);
	// `reservedCD` keeps track of the Crypto Dev tokens Reserve balance in the Exchange contract
	const [reservedCD, setReservedCD] = useState(zero);
	// Keeps track of the ether balance in the contract
	const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
	// cdBalance is the amount of `CD` tokens help by the users account
	const [cdBalance, setCDBalance] = useState(zero);
	// `lpBalance` is the amount of LP tokens held by the users account
	const [lpBalance, setLPBalance] = useState(zero);
	/** Variables to keep track of liquidity to be added or removed */
	// addEther is the amount of Ether that the user wants to add to the liquidity
	const [addEther, setAddEther] = useState(zero);
	// addCDTokens keeps track of the amount of CD tokens that the user wants to add to the liquidity
	// in case when there is no initial liquidity and after liquidity gets added it keeps track of the
	// CD tokens that the user can add given a certain amount of ether
	const [addCDTokens, setAddCDTokens] = useState(zero);
	// removeEther is the amount of `Ether` that would be sent back to the user based on a certain number of `LP` tokens
	const [removeEther, setRemoveEther] = useState(zero);
	// removeCD is the amount of `Crypto Dev` tokens that would be sent back to the user based on a certain number of `LP` tokens
	// that he wants to withdraw
	const [removeCD, setRemoveCD] = useState(zero);
	// amount of LP tokens that the user wants to remove from liquidity
	const [removeLPTokens, setRemoveLPTokens] = useState('0');
	/** Variables to keep track of swap functionality */
	// Amount that the user wants to swap
	const [swapAmount, setSwapAmount] = useState('');
	// This keeps track of the number of tokens that the user would receive after a swap completes
	const [tokenToBeReceivedAfterSwap, settokenToBeReceivedAfterSwap] =
		useState(zero);
	// Keeps track of whether  `Eth` or `Crypto Dev` token is selected. If `Eth` is selected it means that the user
	// wants to swap some `Eth` for some `Crypto Dev` tokens and vice versa if `Eth` is not selected
	const [ethSelected, setEthSelected] = useState(true);
	/** Wallet connection */
	// Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
	const web3ModalRef = useRef();
	// walletConnected keep track of whether the user's wallet is connected or not
	const [walletConnected, setWalletConnected] = useState(false);

	/**
	 * getAmounts call various functions to retrive amounts for ethbalance,
	 * LP tokens etc
	 */
	const getAmounts = async () => {};

	/**** SWAP FUNCTIONS ****/

	/**
	 * swapTokens: Swaps  `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
	 */
	const _swapTokens = async () => {};

	/**
	 * _getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/Crypto Dev tokens that can be received
	 * when the user swaps `_swapAmountWEI` amount of Eth/Crypto Dev tokens.
	 */
	const _getAmountOfTokensReceivedFromSwap = async (_swapAmount) => {};

	/*** END ***/

	/**** ADD LIQUIDITY FUNCTIONS ****/

	/**
	 * _addLiquidity helps add liquidity to the exchange,
	 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
	 * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
	 * then we calculate the crypto dev tokens he can add, given the Eth he wants to add by keeping the ratios
	 * constant
	 */
	const _addLiquidity = async () => {};

	/**** END ****/

	/**** REMOVE LIQUIDITY FUNCTIONS ****/

	/**
	 * _removeLiquidity: Removes the `removeLPTokensWei` amount of LP tokens from
	 * liquidity and also the calculated amount of `ether` and `CD` tokens
	 */
	const _removeLiquidity = async () => {};

	/**
	 * _getTokensAfterRemove: Calculates the amount of `Ether` and `CD` tokens
	 * that would be returned back to user after he removes `removeLPTokenWei` amount
	 * of LP tokens from the contract
	 */
	const _getTokensAfterRemove = async (_removeLPTokens) => {};

	/**** END ****/

	/**
	 * connectWallet: Connects the MetaMask wallet
	 */
	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
			setWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	/**
	 * Returns a Provider or Signer object representing the Ethereum RPC with or
	 * without the signing capabilities of Metamask attached
	 *
	 * A `Provider` is needed to interact with the blockchain - reading
	 * transactions, reading balances, reading state, etc.
	 *
	 * A `Signer` is a special type of Provider used in case a `write` transaction
	 * needs to be made to the blockchain, which involves the connected account
	 * needing to make a digital signature to authorize the transaction being
	 * sent. Metamask exposes a Signer API to allow your website to request
	 * signatures from the user using Signer functions.
	 *
	 * @param {*} needSigner - True if you need the signer, default false
	 * otherwise
	 */
	const getProviderOrSigner = async (needSigner = false) => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);
		console.log('Getting provider or signer', provider);

		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 4) {
			window.alert('Change the network to rinkeby');
			throw new Error('Change Network to Rinkeby');
		}
		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		console.log('Provider:', web3Provider);
		return web3Provider;
	};

	// useEffects are used to react to changes in state of the website
	// The array at the end of function call represents what state changes will trigger this effect
	// In this case, whenever the value of `walletConnected` changes - this effect will be called
	useEffect(() => {
		// if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
		if (!walletConnected) {
			// Assign the Web3Modal class to the reference object by setting it's `current` value
			// The `current` value is persisted throughout as long as this page is open
			web3ModalRef.current = new Web3Modal({
				network: 'rinkeby',
				providerOptions: {},
				disableInjectedProvider: false,
			});
			connectWallet();
			getAmounts();
		}
	}, [walletConnected]);

	/*
      renderButton: Returns a button based on the state of the dapp
  */
	const renderButton = () => {
		return <button className={styles.button}>Test Button</button>;
	};

	return (
		<div>
			<Head>
				<title>Crypto Devs</title>
				<meta name="description" content="Whitelist-Dapp" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.main}>
				<div>
					<h1 className={styles.title}>Welcome to Crypto Devs Exchange!</h1>
					<div className={styles.description}>
						Exchange Ethereum &#60;&#62; Crypto Dev Tokens
					</div>
					<div>
						<button
							className={styles.button}
							onClick={() => {
								setLiquidityTab(true);
							}}
						>
							Liquidity
						</button>
						<button
							className={styles.button}
							onClick={() => {
								setLiquidityTab(false);
							}}
						>
							Swap
						</button>
					</div>
					{renderButton()}
				</div>
				<div>
					<img className={styles.image} src="./cryptodev.svg" />
				</div>
			</div>

			<footer className={styles.footer}>
				Made with &#10084; by Crypto Devs
			</footer>
		</div>
	);
}
