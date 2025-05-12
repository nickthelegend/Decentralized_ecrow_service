import { Contract  } from '@algorandfoundation/tealscript';


export class QuestContract extends Contract {


    questTitle= GlobalStateKey<string>();
    questLocation = GlobalStateKey<string>();
    winner1 = GlobalStateKey<Address>();
    winner2 = GlobalStateKey<Address>();
    winner3= GlobalStateKey<Address>();
    expiryDate = GlobalStateKey<uint64>();
    reward1 =  GlobalStateKey<AssetID>();




    createApplication(
        questTitle: string,
        questLocation: string,
        expiryDate: uint64
      ): void {
        // Ensure this is only called during application creation
        assert(this.app.id == 0, "This method can only be called during application creation");
        
        // Set initial global state values
        this.questTitle.value = questTitle;
        this.questLocation.value = questLocation;
        this.expiryDate.value = expiryDate;
        
        // Log the creation event
      }

      createNFTReward(assetUrl : string): uint64 {
        const itxnResult = sendAssetCreation({
          configAssetTotal: 1,  // Use configAssetTotal instead of total
          configAssetDecimals: 0,      // Use configAssetDecimals instead of decimals
          configAssetUnitName: "NFT",  // Use configAssetUnitName instead of unitName
          configAssetName: this.questTitle.value, // Use configAssetName instead of assetName
          configAssetURL : assetUrl,
          fee: 3000,
          
        });
        // log("Asset Created: " + itxnResult.id.toString());
return itxnResult.id

      }

      optIntoAsset(): void {
        /// Only allow app creator to opt the app account into a ASA
        verifyAppCallTxn(this.txn, { sender: globals.creatorAddress });
    
        
    
        /// Submit opt-in transaction: 0 asset transfer to self
        sendAssetTransfer({
          assetReceiver: this.app.address,
          xferAsset: AssetID.fromUint64(734399300),
          assetAmount: 0,
        });
      }







      sendRewardWinner1(winner: Address): void {
                verifyAppCallTxn(this.txn, { sender: globals.creatorAddress });

        sendAssetTransfer({
          xferAsset: this.reward1.value, // Use the value directly, don't wrap it in AssetID()
          assetReceiver: winner,
          assetAmount: 1,
          fee: 0
        });


        sendAssetTransfer({
          xferAsset: AssetID.fromUint64(734399300), // Use the value directly, don't wrap it in AssetID()
          assetReceiver: winner,
          assetAmount: 100,
          fee: 0
        });

      }




      sendRewardWinner2(winner: Address): void {
        
        sendAssetTransfer({
          xferAsset: AssetID.fromUint64(734399300), // Use the value directly, don't wrap it in AssetID()
          assetReceiver: winner,
          assetAmount: 50,
          fee: 0
        });
      }



      sendRewardWinner3(winner: Address): void {
        
        sendAssetTransfer({
          xferAsset: AssetID.fromUint64(734399300), // Use the value directly, don't wrap it in AssetID()
          assetReceiver: winner,
          assetAmount: 25,
          fee: 0
        });
      }



}