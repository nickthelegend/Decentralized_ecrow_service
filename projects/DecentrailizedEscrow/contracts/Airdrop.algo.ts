import { createAsset } from '@algorandfoundation/algokit-utils';
import { Contract } from '@algorandfoundation/tealscript'





export class AirDrop extends Contract {



    assetID =  GlobalStateKey<AssetID>();
    creatorAddress =  GlobalStateKey<Address>();
    tokenName = GlobalStateKey<string>();
    amountRemaining = GlobalStateKey<uint64>();
    numClaims = GlobalStateKey<uint64>();
    maxClaims = GlobalStateKey<uint64>();
    expiryDate = GlobalStateKey<uint64>();
    amountToSend = GlobalStateKey<uint64>();
    // nftAsset = GlobalStateKey<uint64>();
            claimedMap = BoxMap<Address, bytes32>()

     createApplication(creatorAddress: Address, tokenName: string, assetID: AssetID , numClaims : uint64, maxClaims: uint64, expiryDate : uint64, amountToSend : uint64) :  void {
       



        this.creatorAddress.value = creatorAddress;
        this.tokenName.value = tokenName;
        this.assetID.value = assetID;

        this.numClaims.value = numClaims;

        this.maxClaims.value = maxClaims;
        this.expiryDate.value = expiryDate;

this.amountToSend.value = amountToSend;
        

    }

    optinAsset(): void{

        assert(this.txn.sender == this.app.creator)
 sendAssetTransfer({
            xferAsset: this.assetID.value,
            assetReceiver: this.app.address,
            assetAmount: 0,
        })

    }



    // createNFT(assetName : string){

    //     const asset =  sendAssetCreation({
    //         configAssetName: assetName,
    //         configAssetTotal: 1,
    //         configAssetDecimals: 0,
    //         configAssetUnitName: "BEAST",
    //     })
    //     this.nftAsset.value = asset.id

    // }

        

    claimDrop(){
        assert(this.txn.sender !==  this.app.creator, 'drop creator cannot claim')
        assert(this.txn.sender.isOptedInToAsset(this.assetID.value), 'claimant must already be opted-in to token!')
        assert(this.expiryDate.value >= globals.latestTimestamp , 'DROP expired')
        assert(!this.claimedMap(this.txn.sender).exists, 'already claimed')

        this.claimedMap(this.txn.sender).value =  this.txn.txID as bytes32 

        this.numClaims.value += 1
        
        this.sendTokensFromDrop(this.amountToSend.value, this.txn.sender)

    }

/**
     * Sends a specified amount of tokens from a token drop to the given receiver
     * and updates the remaining balance of the drop. If the drop is fully claimed,
     * it is removed from the active drops.
     *
     * @param {uint64} amountToSend - Information about the token drop, including the token type and remaining balance.
     * @param {Address} receiver - The address of the recipient who will receive the tokens.
     * @return {uint64} The remaining balance of tokens in the token drop after the transfer.
     */
    private sendTokensFromDrop(amountToSend: uint64,receiver:Address): uint64 {
        sendAssetTransfer({
            xferAsset: this.assetID.value,
            assetReceiver: receiver,
            assetAmount: amountToSend,
        })

        // make sure we track the latest balance for what was just claimed by user
        const remaining = this.amountRemaining.value - amountToSend

        return remaining
    }

}