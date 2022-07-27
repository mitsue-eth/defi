//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _CryptoDevToken) ERC20("CryptoDev LP Token", "CDLP") {
        require(
            _CryptoDevToken != address(0),
            "Token address passed is a null address"
        );
        cryptoDevTokenAddress = _CryptoDevToken;
    }

    //function returns the amount of ERC20 tokens which are held by this contract

    function getReserve() public view returns (uint256) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if (cryptoDevTokenReserve == 0) {
            //user transfers the same amount of crypto dev tokens here as he puts eth into this contract
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            //user gets CDLT for his ETH and CDT sent to this contract
            _mint(msg.sender, liquidity);
        } else {
            //calculate how much ETH reserve contract had before the user sent hit ETH
            uint256 ethReserve = ethBalance - msg.value;
            //calculate how much CDT the user should add for the ETH he is sending
            uint256 cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) /
                (ethReserve);
            //transfer the CDT to this contract in this amount
            cryptoDevToken.transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            //amount of CDLT to be sent to the user for his ETH and CDT is proportional to the amount of LT already in the contract and ETH in the contract
            //calculate this amount
            liquidity = (totalSupply() * msg.value) / ethReserve;
            //mint this amount to the user
            _mint(msg.sender, liquidity);
        }
        //liquidity is the amount of CDLT issued as a result of this function call
        return liquidity;
    }

    //when liquidity is removed, CDLT are burn, ETH is sent back to the User and User again becomes the owner of some CDT (before that the ownership was transferred fom user to the exchange contract)
    function removeLiquidity(uint256 _amount)
        public
        returns (uint256, uint256)
    {
        require(_amount > 0, "_amount should be greater than zero");
        //total ETH in this contract
        uint256 ethReserve = address(this).balance;
        //total CDLT issued by this contract
        uint256 _totalSupply = totalSupply();

        //amount of ETH to get back is proportional to how much LT the user holds in proportion to total supply of these LT by this contract mutiplied by total ETH reserve
        //% of LT tokens from total balance user has = % of ETH from total ETH balance the user will get = % of total amount of CDT user will get back of total CDT in the contract
        uint256 ethAmount = (ethReserve * _amount) / _totalSupply;
        uint256 cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;

        //burn the CDLT user is returning
        _burn(msg.sender, _amount);

        //transfer ETH to the user
        payable(msg.sender).transfer(ethAmount);
        //transfer CDT to the user
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);

        //returns how much ETH and CDT the user gets back
        return (ethAmount, cryptoDevTokenAmount);
    }

    //function calculates how much token should the user receive if he inputs another token
    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(
            inputReserve > 0 && outputReserve > 0,
            "invalid amount of reserves"
        );
        //1% of fee charged, so user is inputting 99% of token, 1% will go to the contract
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    //function which for inputted ETH gives bach to the user the amount of CDT, but not lower than some Min AMount
    function ethToCryptoDevToken(uint256 _minToken) public payable {
        //reserve of CDT
        uint256 tokenReserve = getReserve();
        //amount of CDT to be received in exchange for ETH sent
        uint256 tokensBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );
        require(tokensBought >= _minToken, "Insufficient output amount");

        //transfer CDT to the user
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }

    //function which gives to the user ETH for the CDT inputted
    function cryptoDevTokenToEth(uint256 _tokensSold, uint256 _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );

        require(ethBought >= _minEth, "Insufficient output amount");

        //transfer CDT from user to the contract
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );

        //send ETH from contract to the user
        payable(msg.sender).transfer(ethBought);
    }
}
