// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTFactory is ERC721, Ownable {
    // string private name;
    // string private symbol;
    string private imageURI;
    string private sizeOfPicture;
    uint256 private year;
    string private nameOfAuthor;
    string private style;

    struct NFTMetadata {
        string name_;
        string ticker_;
        string imageURI_;
        string sizeOfPicture_;
        uint256 year_;
        string nameOfAuthor_;
        string style_;
    }

    NFTMetadata private _tokenMetadata;

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _imageURI,
        string memory _sizeOfPicture,
        uint256 _year,
        string memory _nameOfAuthor,
        string memory _style
    ) ERC721(_name, _symbol) {
        imageURI = _imageURI;
        sizeOfPicture = _sizeOfPicture;
        year = _year;
        nameOfAuthor = _nameOfAuthor;
        style = _style;

        mintNFT(_name, _symbol, imageURI, sizeOfPicture, year, nameOfAuthor, style);
    }

    function mintNFT(
        string memory _name, 
        string memory _ticker, 
        string memory _imageURI,
        string memory _sizeOfPicture,
        uint256 _year,
        string memory _nameOfAuthor,
        string memory _style
    ) public onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_ticker).length > 0, "Ticker cannot be empty");
        require(bytes(_imageURI).length > 0, "Image URI cannot be empty");
        require(bytes(_sizeOfPicture).length > 0, "Size of Picture cannot be empty");
        require(_year > 0, "Year cannot be empty");
        require(bytes(_nameOfAuthor).length > 0, "Name Of Author cannot be empty");
        require(bytes(_style).length > 0, "Style cannot be empty");

        _tokenMetadata = NFTMetadata(
            _name, 
            _ticker, 
            _imageURI, 
            _sizeOfPicture, 
            _year, 
            _nameOfAuthor, 
            _style
        );
        _safeMint(msg.sender, 1);
    }

    function setNFTMetadata(
        string memory _name, 
        string memory _ticker, 
        string memory _imageURI,
        string memory _sizeOfPicture,
        uint256 _year,
        string memory _nameOfAuthor,
        string memory _style
    ) public onlyOwner {
        require(_exists(1), "NFT does not exist");

        _tokenMetadata.name_ = _name;
        _tokenMetadata.ticker_ = _ticker;
        _tokenMetadata.imageURI_ = _imageURI;
        _tokenMetadata.sizeOfPicture_ = _sizeOfPicture;
        _tokenMetadata.year_ = _year;
        _tokenMetadata.nameOfAuthor_ = _nameOfAuthor;
        _tokenMetadata.style_ = _style;
    }

    function getNFTMetadata() public view returns (NFTMetadata memory) {
        require(_exists(1), "NFT does not exist");
        return _tokenMetadata;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenMetadata.imageURI_;
    }

    function name() public view virtual override returns (string memory) {
        return _tokenMetadata.name_;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenMetadata.ticker_;
    }
}
