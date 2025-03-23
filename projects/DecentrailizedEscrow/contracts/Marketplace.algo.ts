import { Contract } from '@algorandfoundation/tealscript';



export class Marketplace extends Contract {

    price = GlobalStateKey<uint64>();

    paymentAmount = GlobalStateKey<uint64>();


    buyer = GlobalStateKey<Address>();
  

    conditionMet = GlobalStateKey<boolean>();

    seller = GlobalStateKey<Address>();

    nftAssetID = GlobalStateKey<AssetID>();
    questAssetID = GlobalStateKey<AssetID>();


    createApplication(seller: Address,price: uint64 ): void {
        this.price.value = price;
        this.paymentAmount.value = 0;
        this.seller.value = seller;
        this.buyer.value = Address.zeroAddress;
        this.nftAssetID.value = AssetID.zeroIndex;
        this.questAssetID.value = AssetID.zeroIndex;

      }


      optIntoAsset(asset: AssetID): void {
    
        /// Verify a ASA hasn't already been opted into
        assert(this.questAssetID.value === AssetID.zeroIndex);
    
        /// Save ASA ID in global state
        this.questAssetID.value = asset;
    
        /// Submit opt-in transaction: 0 asset transfer to self
        sendAssetTransfer({
          assetReceiver: this.app.address,
          xferAsset: asset,
          assetAmount: 0,
        });
      }



      optIntoNFT(asset: AssetID): void {    
        /// Verify a ASA hasn't already been opted into
        assert(this.nftAssetID.value === AssetID.zeroIndex);
    
        /// Save ASA ID in global state
        this.nftAssetID.value = asset;
    
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
            this.txn.sender === this.seller.value
        );
        assert(this.paymentAmount.value >= this.price.value); // Check if the condition is met
    
        sendPayment({
          receiver: this.seller.value,
          amount: this.paymentAmount.value,
        });
        this.paymentAmount.value = 0;
      }


      buyNFT(ebaTxn: AssetTransferTxn): void {
    
        verifyAssetTransferTxn(ebaTxn, {
            assetReceiver: this.app.address,
            xferAsset: this.questAssetID.value
        });
        this.buyer.value = this.txn.sender
        this.paymentAmount.value = ebaTxn.assetAmount;
      }


      recieveNFT(asset: AssetID){
        assert( this.txn.sender === this.buyer.value);
        assert(this.paymentAmount.value >= this.price.value); // Check if the condition is met

        sendAssetTransfer({
            assetReceiver: this.buyer.value,
            xferAsset: asset,
            assetAmount: 1,
          });
      }

      cancelSell(){
        assert( this.txn.sender === this.seller.value);

        sendAssetTransfer({
            assetReceiver: this.seller.value,
            xferAsset: this.nftAssetID.value,
            assetAmount: 1,
          });
      }

}
