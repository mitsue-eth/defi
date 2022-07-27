require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '.env' });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
	solidity: '0.8.4',
	networks: {
		rinkeby: {
			url: ALCHEMY_API_KEY_URL,
			accounts: [RINKEBY_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			rinkeby: ETHERSCAN_API_KEY,
		},
		customChains: [
			{
				network: 'rinkeby',
				chainId: 4,
				urls: {
					apiURL: 'https://api-rinkeby.etherscan.io/api',
					browserURL: 'https://rinkeby.etherscan.io',
				},
			},
		],
	},
};
