import { Contract } from '@algorandfoundation/tealscript';



export class MarketService extends Contract {

    requiredAmount = GlobalStateKey<uint64>();

    paymentAmount = GlobalStateKey<uint64>();


    reciever = GlobalStateKey<Address>();
  
    asaAmt = GlobalStateKey<uint64>();

    conditionMet = GlobalStateKey<boolean>();

    owner = GlobalStateKey<Address>();

    asa = GlobalStateKey<AssetID>();

    assetToken = GlobalStateKey<AssetID>();

    createApplication(worker: Address, adminAddress: Address): void {
        this.requiredAmount.value = 10;
        this.paymentAmount.value = 0;
        this.reciever.value = worker;
        this.conditionMet.value = false;
        this.owner.value = adminAddress;
        this.asa.value = AssetID.zeroIndex;
        this.assetToken.value = AssetID.zeroIndex;

      }


      optIntoAsset(asset: AssetID): void {
    
        /// Verify a ASA hasn't already been opted into
        assert(this.asa.value === AssetID.zeroIndex);
    
        /// Save ASA ID in global state
        this.asa.value = asset;
    
        /// Submit opt-in transaction: 0 asset transfer to self
        sendAssetTransfer({
          assetReceiver: this.app.address,
          xferAsset: asset,
          assetAmount: 0,
        });
      }



      optIntoToken(asset: AssetID): void {
        /// Only allow app creator to opt the app account into a ASA
        verifyAppCallTxn(this.txn, { sender: globals.creatorAddress });
    
        /// Verify a ASA hasn't already been opted into
        assert(this.asa.value === AssetID.zeroIndex);
    
        /// Save ASA ID in global state
        this.assetToken.value = asset;
    
        /// Submit opt-in transaction: 0 asset transfer to self
        sendAssetTransfer({
          assetReceiver: this.app.address,
          xferAsset: asset,
          assetAmount: 0,
        });
      }


      takeFunds(): void {
        assert(
          this.txn.sender === this.app.creator ||
            this.txn.sender === this.owner.value
        );
        assert(this.paymentAmount.value >= this.requiredAmount.value); // Check if the condition is met
    
        sendPayment({
          receiver: this.owner.value,
          amount: this.paymentAmount.value,
        });
        this.paymentAmount.value = 0;
      }


      addFundsToEscrow(ebaTxn: AssetTransferTxn): void {
        assert(this.txn.sender === this.reciever.value);
    
        verifyAssetTransferTxn(ebaTxn, {
            assetReceiver: this.app.address,
            xferAsset: this.assetToken.value
        });
    
        this.paymentAmount.value = ebaTxn.assetAmount;
      }


      recieveNFT(asset: AssetID){
        assert( this.txn.sender === this.reciever.value);
        assert(this.paymentAmount.value >= this.requiredAmount.value); // Check if the condition is met

        sendAssetTransfer({
            assetReceiver: this.reciever.value,
            xferAsset: asset,
            assetAmount: 1,
          });
      }


}
