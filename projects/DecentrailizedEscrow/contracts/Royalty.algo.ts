import { Contract } from '@algorandfoundation/tealscript';



export class RoyaltyNFTMarketplace extends Contract {

  pricePersonal = GlobalStateKey<uint64>();
  priceCommercial = GlobalStateKey<uint64>();
  priceExclusive = GlobalStateKey<uint64>();

  royaltyPercent = GlobalStateKey<uint64>(); // e.g., 5% royalty = 5

  creator = GlobalStateKey<Address>();
  currentOwner = GlobalStateKey<Address>();
  nftAssetID = GlobalStateKey<AssetID>();
    
  // License purchased by user
  buyerLicense = GlobalStateKey<string>();
  expectedAmount = GlobalStateKey<uint64>();

  createApplication(
    creator: Address,
    pricePersonal: uint64,
    priceCommercial: uint64,
    priceExclusive: uint64,
    royaltyPercent: uint64
  ): void {
    this.pricePersonal.value = pricePersonal;
    this.priceCommercial.value = priceCommercial;
    this.priceExclusive.value = priceExclusive;
    this.royaltyPercent.value = royaltyPercent;
    this.creator.value = creator;
    this.currentOwner.value = creator;
    this.nftAssetID.value = AssetID.zeroIndex;
    // this.buyerLicense.value = "personal";
  }

  optIntoNFT(asset: AssetID): void {
    assert(this.nftAssetID.value === AssetID.zeroIndex);
    this.nftAssetID.value = asset;

    sendAssetTransfer({
      assetReceiver: this.app.address,
      xferAsset: asset,
      assetAmount: 0,
    });
  }

  buyLicense(payment: PayTxn, licenseType: string): void {
    verifyPayTxn(payment, {
      receiver: this.app.address,
    });

    let expectedAmount: uint64;

    if (licenseType === "personal") {
      expectedAmount = this.pricePersonal.value;
    } else if (licenseType === "commercial") {
      expectedAmount = this.priceCommercial.value;
    } else if (licenseType ==="exclusive") {
      expectedAmount = this.priceExclusive.value;
    } else {
      assert(false, "Invalid license type.");
    }

    assert(payment.amount >= this.expectedAmount.value);

    this.buyerLicense.value = licenseType;

    if (licenseType === "exclusive") {
      // Full ownership transfer
      this.transferOwnership(payment.sender);
    } else {
      // Only license rights, no NFT transfer
      this.payRoyalty(this.creator.value, payment.amount);
    }
  }

  transferOwnership(newOwner: Address): void {
    sendAssetTransfer({
      assetReceiver: newOwner,
      xferAsset: this.nftAssetID.value,
      assetAmount: 1,
    });
    this.currentOwner.value = newOwner;
  }

  payRoyalty(to: Address, amountPaid: uint64): void {
    let royaltyAmount = (amountPaid * this.royaltyPercent.value) / 100;

    sendPayment({
      receiver: to,
      amount: royaltyAmount,
    });

    // Optionally, refund extra payment if overpaid
  }

  cancelListing(): void {
    assert(this.txn.sender === this.creator.value || this.txn.sender === this.currentOwner.value);

    sendAssetTransfer({
      assetReceiver: this.currentOwner.value,
      xferAsset: this.nftAssetID.value,
      assetAmount: 1,
    });
  }
}
