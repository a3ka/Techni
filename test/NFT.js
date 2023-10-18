const { expect } = require('chai');
const { ethers } = require('hardhat');

// const tokens = (n) => {
//     return ethers.utils.parseUnits(n.toString(), 'ether')
// }

describe('NFT', () => {
    let nft, tokenMetadata, accounts, addresses, deployer, receiver, owner, exchange
    let tokenNumber = 1;

    beforeEach(async () => {
        const NFTFactory = await ethers.getContractFactory('NFTFactory')
        nft = await NFTFactory.deploy(
            "Torso #1", // Name
            "TRS1", // Symbol
            "https://image-uri.com", //
            "1056x398",
            1928, // Year
            "Kazemir Malevitch",
            "Postsuprematism"
          );


        accounts = await ethers.getSigners()

        addresses = accounts.map((account) => account.address);
        deployer = addresses[0]
        receiver = addresses[1]
        owner = addresses[2]
        exchange = addresses[3]

        tokenMetadata = await nft.getNFTMetadata()


        // console.log("NFT OWNER of #1: " + await nft.ownerOf(1));
        // console.log("DEPLOYER: " + deployer);
        // console.log("receiver: " + receiver);
        // console.log("owner: " + owner);
        // console.log("balance of NFT after deployment by deployer account: " + await nft.balanceOf(deployer));
        // console.log("tokenMetadata: " + tokenMetadata);
        // console.log("TYPE: " + typeof(tokenMetadata));
        // console.log("tokenMetadata.imageURI: " + tokenMetadata.imageURI_);


    })

    describe('Deployment', () => {
        const name = 'Torso #1'
        const symbol = 'TRS1'
        const imageURI = 'https://image-uri.com'
        const sizeOfPicture = '1056x398';
        const year = 1928;
        const nameOfAuthor = 'Kazemir Malevitch';
        const style = 'Postsuprematism';

        it('has correct name', async () => {
            expect(await nft.name()).to.equal(name)
        })

        it('has correct symbol', async () => {
            expect(await nft.symbol()).to.equal(symbol)
        })

        it('has correct imageURI', async () => {
            expect(tokenMetadata.imageURI_).to.equal(imageURI)
        })
        it('has correct size Of picture', async () => {
            expect(tokenMetadata.sizeOfPicture_).to.equal(sizeOfPicture)
        })
        it('has correct year Of production', async () => {
            expect(tokenMetadata.year_).to.equal(year)
        })
        it('has correct name Of Author', async () => {
            expect(tokenMetadata.nameOfAuthor_).to.equal(nameOfAuthor)
        })
        it('has correct name style', async () => {
            expect(tokenMetadata.style_).to.equal(style)
        })
        it('owner of NFT after deployment', async () => {
            expect(await nft.ownerOf(1)).to.equal(deployer)
        })

        it('balance of NFT after deployment by deployer account', async () => {
            expect(await nft.balanceOf(deployer)).to.equal(1)
        })
    })


    describe('Sending NFT', () => {
        let amount, transaction, result

        describe('Success', () => {

            beforeEach(async () => {
                
                // transaction = await token.connect(deployer).transfer(receiver.address, amount)
                transaction = await nft.safeTransferFrom(deployer, receiver, tokenNumber)
                result =  transaction.wait()
                
                console.log("OWNER RECEIVER: " + await nft.ownerOf(1));
                let tx = await token.connect(receiver).transfer(receiver, deployer, amount)
                console.log("OWNER AFTER SENDING FROM RECEIVER: " + await nft.ownerOf(1));
            })

            // it('owner of NFT after sending from deployer to receiver ', async () => {
            //     expect(await nft.ownerOf(1)).to.equal(receiver)
            // })

            // it('nft owner after transfer from deployer to receiver', async () => {
            //     expect(await nft.ownerOf(1)).to.equal(receiver)
            // })

            // it('receiver has 1 NFT', async () => {
            //     expect(await nft.balanceOf(receiver)).to.equal(1)
            // })

            // it('approve deployer address', async () => {
            //     await expect(nft.connect(receiver).approve(deployer, tokenNumber))
            // })
            // it('transfer from receiver to deployer', async () => {
            //     await expect(nft.connect(receiver).safeTransferFrom(receiver, deployer, tokenNumber))
            // })
            // it('owner of NFT after sending from receiver to deployer', async () => {
            //     expect(await nft.ownerOf(1)).to.equal(deployer)
            // })
            // it('balance of NFT after deployment by deployer account', async () => {
            //     expect(await nft.balanceOf(deployer)).to.equal(1)
            // })

            //----------------------------------------------------------------

            // it('emits a Transfer event', async () => {
            //     // const event = result.events[0]
            //     // expect(event.event).to.equal('Transfer')

            //     // const args = event.args
            //     // expect(args.from).to.equal(receiver.address)
            //     // expect(args.to).to.equal(deployer.address)
            //     // expect(args.value).to.equal(amount)

            //     const events = transaction.events;
            //     const transferEvent = events.find((event) => event.event === 'Transfer');
  
            //     expect(transferEvent.args.from).to.equal(receiver.address);
            //     expect(transferEvent.args.to).to.equal(deployer.address);
            //     expect(transferEvent.args.tokenId).to.equal(tokenNumber);
            // })

        })

        describe('Failure', () => {
            it('Transfer from deployer to receiver with wrong token number', async () => {
                await expect(nft.safeTransferFrom(deployer, receiver, 2)).to.be.reverted
            })

            it('nft owner after transfer from deployer to receiver', async () => {
                expect(await nft.ownerOf(1)).to.equal(deployer)
            })

            it('rejects invalid recipient', async () => {
                await expect(nft.safeTransferFrom(deployer, '0x0000000000000000000000000000000000000000', 1)).to.be.reverted
            })
        })
    })

    // describe('Approving Tokens', () => {
    //     let amount, transaction, result

    //     beforeEach(async () => {
    //         amount = tokens(100)
    //         transaction = await token.connect(deployer).approve(exchange.address, amount)
    //         result = await transaction.wait()
    //     })

    //     describe('Success', () => {
    //         it('allocates an allowance for delegated token spending', async () => {
    //             expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
    //         })

    //         it('emits an Approval event', async () => {
    //             const event = result.events[0]
    //             expect(event.event).to.equal('Approval')

    //             const args = event.args
    //             expect(args.owner).to.equal(deployer.address)
    //             expect(args.spender).to.equal(exchange.address)
    //             expect(args.value).to.equal(amount)
    //         })

    //     })

    //     describe('Failure', () => {
    //         it('rejects invalid spenders', async () => {
    //             await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
    //         })
    //     })

    // })

    // describe('Delegated Token Transfers', () => {
    //     let amount, transaction, result

    //     beforeEach(async () => {
    //         transaction = await token.connect(deployer).approve(exchange, tokenNumber)
    //         result = await transaction.wait()
    //     })

    //     describe('Success', () => {
    //         beforeEach(async () => {
    //             transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
    //             result = await transaction.wait()
    //         })

    //         it('transfers token balances', async () => {
    //             expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
    //             expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
    //         })

    //         it('rests the allowance', async () => {
    //             expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
    //         })

    //         it('emits a Transfer event', async () => {
    //             const event = result.events[0]
    //             expect(event.event).to.equal('Transfer')

    //             const args = event.args
    //             expect(args.from).to.equal(deployer.address)
    //             expect(args.to).to.equal(receiver.address)
    //             expect(args.value).to.equal(amount)
    //         })

    //     })

    //     describe('Failure', async () => {
    //         // Attempt to transfer too many tokens
    //         const invalidAmount = tokens(100000000) // 100 Million, greater than total supply
    //         await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
    //     })

    // })

})
