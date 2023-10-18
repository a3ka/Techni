const { expect } = require('chai');
const { ethers } = require('hardhat');
// const { ethers, Log } = require('ethers');


describe('Token', () => {
    let nft, token, tokenMetadata, accounts, addresses, deployer, receiver, owner
    let acc1, acc2, acc3
    let addressNFT, addressToken
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

        await nft.waitForDeployment();
        addressNFT = await nft.getAddress();
        
        const TokenFactory = await ethers.getContractFactory('TokenFactory')
        token = await TokenFactory.deploy(
            "Torso #1(ERC-20)",
            "TRS1th",
            addressNFT,
            10000
        )
          
        await token.waitForDeployment();
        addressToken = await token.getAddress();
        

        accounts = await ethers.getSigners()

        addresses = accounts.map((account) => account.address);
        deployer = addresses[0]
        receiver = addresses[1]
        owner = addresses[2]
        exchange = addresses[3]
        acc1 = addresses[4]
        acc2 = addresses[5]
        acc3 = addresses[6]


        tokenMetadata = await nft.getNFTMetadata()

        // await nft.connect(deployer).approve(addressToken, 1)
        await nft.approve(addressToken, 1)
    

        // console.log("DEPLOYER: " + deployer);
        // console.log("receiver: " + receiver);
        // console.log("owner: " + owner);
        // console.log("NFT OWNER of #1: " + await nft.ownerOf(1));
        // console.log("NFT BALANCE OF DEPLOYER: " + await nft.balanceOf(deployer));
        // console.log("TOKEN ADDRESS: " + addressToken);
        

       
        // console.log("balance of NFT after deployment by deployer account: " + await nft.balanceOf(deployer));
        // console.log("tokenMetadata: " + tokenMetadata);
        // console.log("TYPE: " + typeof(tokenMetadata));
        // console.log("tokenMetadata.imageURI: " + tokenMetadata.imageURI_);
        // console.log("TOKEN BALANCE: " + await token.balanceOf(deployer));
        // console.log("TOKEN SUPPLY: " + await token.totalSupply());


    })

    describe('Deployment of ERC-20 Contract', () => {
        const name = "Torso #1(ERC-20)"
        const symbol = 'TRS1th'
        // const totalSupply = tokens('10000')
        // const totalSupply = 10000;


        it('has correct name', async () => {
            expect(await token.name()).to.equal(name)
        })

        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol)
        })

        // it('has correct decimals', async () => {
        //     expect(await token.decimals()).to.equal(decimals)
        // })

        it('has correct total supply', async () => {
            expect(await token.totalSupply()).to.equal(0)
        })

        it('deployer Token balance before transfer:', async () => {
            // expect(await token.balanceOf(deployer)).to.equal(totalSupply)
            expect(await token.balanceOf(deployer)).to.equal(0)
        })
    

    
    })

    describe('Deployment of NFT Contract', () => {
        const name = "Torso #1"
        const symbol = 'TRS1'
        // const totalSupply = tokens('10000')
        // const totalSupply = 10000;


        it('has correct name', async () => {
            expect(await nft.name()).to.equal(name)
        })

        it('has correct symbol', async () => {
            expect(await nft.symbol()).to.equal(symbol)
        })

        it('deployer Token balance before transfer:', async () => {
            // expect(await token.balanceOf(deployer)).to.equal(totalSupply)
            expect(await nft.balanceOf(deployer)).to.equal(1)
        })

    })

    describe('Convert NFT to ERC-20 tokens', () => {

        describe('Success', () => {

            beforeEach(async () => {
                await token.convertToTokens(1) // Convert NFT to ERC-20 tokens
            
            })

            it('deployer Token ERC-20 balance after transfer:', async () => {
                expect(await token.balanceOf(deployer)).to.equal(10000)
            })

            it('owner of NFT after converting it to erc-20 tokens', async () => {
                expect(await nft.ownerOf(1)).to.equal(addressToken)
            })

            it('deployer Token balance before transfer:', async () => {
                // expect(await token.balanceOf(deployer)).to.equal(totalSupply)
                expect(await nft.balanceOf(addressToken)).to.equal(1)
            })
        })

        describe('Failure', () => {
            it('transfer from deployer to receiver with wrong token number', async () => {
                 await expect(nft.safeTransferFrom(addressToken, receiver, 2)).to.be.reverted
            })
            
            it('transfer from deployer to receiver after it was already transfered to token Smart Contract', async () => {
                expect(await nft.safeTransferFrom(deployer, receiver, 1)).to.be.reverted
           })
            
            it('rejects invalid recipient', async () => {
                await expect(nft.safeTransferFrom(addressToken, '0x0000000000000000000000000000000000000000', 1)).to.be.reverted
            })

        })
    })

    describe('Transfer ERC-20 tokens to other wallets', () => {

        describe('Success', () => {

            beforeEach(async () => {
                await token.convertToTokens(1) // Convert NFT to ERC-20 tokens
                await token.transfer(acc1, 2500)
                await token.transfer(acc2, 2500)
                await token.transfer(acc3, 2500)
            })

            it('4 wallets have 2500 erc-20 tokens each:', async () => {
                expect(await token.balanceOf(deployer)).to.equal(2500)
                expect(await token.balanceOf(acc1)).to.equal(2500)
                expect(await token.balanceOf(acc2)).to.equal(2500)
                expect(await token.balanceOf(acc3)).to.equal(2500)
            })

        })

        describe('Failure', () => {
            it('transfer from deployer to receiver more then it has', async () => {
                 await expect(token.transfer(acc3, 3500)).to.be.reverted
            })
            
            it('transfer from deployer to a wrong wallet', async () => {
                await expect(token.transfer('0x0000000000000000000000000000000000000000', 2000)).to.be.reverted
           })

        })
    })

    describe('сonvert ERC-20 tokens back to NFT ', () => {

        describe('Success', () => {
            beforeEach(async () => {
                console.log('NFT OWNER BEFORE сonvertToToken: ' + await nft.ownerOf(1));
                await token.convertToTokens(1)
                console.log('NFT OWNER AFTER сonvertToToken: ' + await nft.ownerOf(1));    
                await token.reclaimNFT(1)
                console.log('NFT OWNER AFTER reclaimeNFT: ' + await nft.ownerOf(1));
            })
    
            it('new NFT balance of deployer is equal to 1', async () => {
                expect(await nft.balanceOf(deployer)).to.equal(1)
            })
    
            // it('owner of NFT after deployment', async () => {
            //     expect(await nft.ownerOf(1)).to.equal(deployer)
            // })
        })
    })



    // describe('Minting 10000 token in exchange for 1 NFT', () => {
    //     // let amount, transaction, result

    //     describe('Success', () => {

    //         beforeEach(async () => {
    
    //             // await nft.approve(token.address, 1, { from: deployer })
    //             // await token.convertToTokens(1, { from: deployer })
    //             // await nft.approve(addressToken, 1)
    //             // awaitit('Transfer from deployer to receiver with wrong token number', async () => {
    // //             await expect(nft.safeTransferFrom(deployer, receiver, 2)).to.be.reverted
    // //         })

    // //         it('nft owner after transfer from deployer to receiver', async () => {
    // //             expect(await nft.ownerOf(1)).to.equal(deployer)
    // //         })

    // //         it('rejects invalid recipient', async () => {
    // //             await expect(nft.safeTransferFrom(deployer, '0x0000000000000000000000000000000000000000', 1)).to.be.reverted
    // //         }) token.convertToTokens(1)

    //             // await nft.connect(deployer).approve(token.address, 1)
    //             // await token.connect(deployer).convertToTokens(1)

    //             console.log("RESULT: " + result);
    //             console.log("NFT OWNER of #1: " + await nft.ownerOf(1));
    //             console.log("NFT BALANCE TokenAddress: " + await nft.balanceOf(addressToken));
    //         })

    //         it('owner of NFT is a Token smart contract address ', async () => {
    //             expect(await nft.ownerOf(1)).to.equal(addressToken)
    //         })


    //         // it('receiver has 1 NFT', async () => {
    //         //     expect(await nft.balanceOf(addressToken)).to.equal(1)
    //         // })

    //         // it('approve Token smart contract address', async () => {
    //         //     await expect(nft.connect(deployer).approve(addressToken, 1))
    //         // })
    //         // it('deployer token balance after distributing', async () => {
    //         //     await expect(token.balanceOf(deployer)).to.equal(10000)
    //         // })
    //         //------------------------------------------------------
    //         // it('emits a Transfer event', async () => {
    //         //     // const event = result.events[0]
    //         //     // expect(event.event).to.equal('Transfer')

    //         //     // const args = event.args
    //         //     // expect(args.from).to.equal(receiver.address)
    //         //     // expect(args.to).to.equal(deployer.address)
    //         //     // expect(args.value).to.equal(amount)

    //         //     const events = transaction.events;
    //         //     const transferEvent = events.find((event) => event.event === 'Transfer');
  
    //         //     expect(transferEvent.args.from).to.equal(receiver.address);
    //         //     expect(transferEvent.args.to).to.equal(deployer.address);
    //         //     expect(transferEvent.args.tokenId).to.equal(tokenNumber);
    //         // })

    //     })

    // //     describe('Failure', () => {
    // //         it('Transfer from deployer to receiver with wrong token number', async () => {
    // //             await expect(nft.safeTransferFrom(deployer, receiver, 2)).to.be.reverted
    // //         })

    // //         it('nft owner after transfer from deployer to receiver', async () => {
    // //             expect(await nft.ownerOf(1)).to.equal(deployer)
    // //         })

    // //         it('rejects invalid recipient', async () => {
    // //             await expect(nft.safeTransferFrom(deployer, '0x0000000000000000000000000000000000000000', 1)).to.be.reverted
    // //         })
    // //     })
    // // })

    // // describe('Approving Tokens', () => {
    // //     let amount, transaction, result

    // //     beforeEach(async () => {
    // //         amount = tokens(100)
    // //         transaction = await token.connect(deployer).approve(exchange.address, amount)
    // //         result = await transaction.wait()
    // //     })

    // //     describe('Success', () => {
    // //         it('allocates an allowance for delegated token spending', async () => {
    // //             expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
    // //         })

    // //         it('emits an Approval event', async () => {
    // //             const event = result.events[0]
    // //             expect(event.event).to.equal('Approval')

    // //             const args = event.args
    // //             expect(args.owner).to.equal(deployer.address)
    // //             expect(args.spender).to.equal(exchange.address)
    // //             expect(args.value).to.equal(amount)
    // //         })

    // //     })

    // //     describe('Failure', () => {
    // //         it('rejects invalid spenders', async () => {
    // //             await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
    // //         })
    // //     })

    // // })

    // // describe('Delegated Token Transfers', () => {
    // //     let amount, transaction, result

    // //     beforeEach(async () => {
    // //         transaction = await token.connect(deployer).approve(exchange, tokenNumber)
    // //         result = await transaction.wait()
    // //     })

    // //     describe('Success', () => {
    // //         beforeEach(async () => {
    // //             transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
    // //             result = await transaction.wait()
    // //         })

    // //         it('transfers token balances', async () => {
    // //             expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
    // //             expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
    // //         })

    // //         it('rests the allowance', async () => {
    // //             expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
    // //         })

    // //         it('emits a Transfer event', async () => {
    // //             const event = result.events[0]
    // //             expect(event.event).to.equal('Transfer')

    // //             const args = event.args
    // //             expect(args.from).to.equal(deployer.address)
    // //             expect(args.to).to.equal(receiver.address)
    // //             expect(args.value).to.equal(amount)
    // //         })

    // //     })

    // //     describe('Failure', async () => {
    // //         // Attempt to transfer too many tokens
    // //         const invalidAmount = tokens(100000000) // 100 Million, greater than total supply
    // //         await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
    // //     })

    // })

})
