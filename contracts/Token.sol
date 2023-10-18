// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFT.sol";

// This Token contract is essentially a vault that keeps the NFT token, and distributes ERC20 in return

contract TokenFactory is ERC20, Ownable {
    address public nftAddress;
    uint256 public supplyPerNFT;

    constructor(
        string memory _name,
        string memory _symbol,
        address _nftAddress,
        uint256 _supplyPerNFT
    ) ERC20(_name, _symbol) {
        supplyPerNFT = _supplyPerNFT;
        nftAddress = _nftAddress;
    }

    function convertToTokens(uint256 _tokenId) public {
        NFTFactory(nftAddress).transferFrom(msg.sender, address(this), _tokenId);
        _mint(msg.sender, supplyPerNFT);
    }

    function reclaimNFT(uint256 _tokenId) public {
        require(balanceOf(msg.sender) >= supplyPerNFT, "Insufficient tokens");
        _burn(msg.sender, supplyPerNFT);
        NFTFactory(nftAddress).safeTransferFrom(address(this), msg.sender, _tokenId);
    }
}
