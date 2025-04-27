import { Contract } from '@algorandfoundation/tealscript';


type Bid = { amount: uint64; deliveryTime: uint64 ,description: string};

export class PurchaseRequest extends Contract {

    product = GlobalStateKey<string>();
    quantity = GlobalStateKey<string>();
    requestCounter = GlobalStateKey<uint64>();
    bidCounter = GlobalStateKey<uint64>();
    deadline = GlobalStateKey<uint64>();
    max_budget = GlobalStateKey<uint64>();
    creator = GlobalStateKey<Address>();
    selected_vendor = GlobalStateKey<Address>();
    delivery_status =GlobalStateKey<string>();
    dispatch_date =  GlobalStateKey<uint64>();
    recieved_date =  GlobalStateKey<uint64>();
    depositedAmount = GlobalStateKey<uint64>();
    vendorBids = BoxMap<Address, Bid>();




    createApplication(product: string, quantity: string, deadline : uint64, max_budget: uint64): void {
        this.product.value = product;
        this.quantity.value = quantity;
        this.requestCounter.value = 0;
        this.bidCounter.value = 0;
        this.deadline.value = deadline;
        this.max_budget.value =max_budget; // initialize with 0 (meaning no vote is active)
        this.creator.value = this.txn.sender; // initialize with 0 (meaning no vote is active)

      }

      submitBid(amount: uint64, deliveryTime: uint64, description: string): void {
        // Directly assign to the BoxMap without creating a temporary variable
        this.vendorBids(this.txn.sender).value = {
          amount: amount,
          deliveryTime: deliveryTime,
          description: description
        };

        this.bidCounter.value +=1
      }

      acceptBid(vendorAddress: Address): void {

        assert(this.txn.sender==this.app.creator)

        this.selected_vendor.value = vendorAddress;

      }
      sendFunds(payment: PayTxn): void {
        assert(this.txn.sender == this.creator.value, "Only company can fund the contract.");
        assert(this.selected_vendor.exists, "Vendor must be selected before sending funds.");
    
        // Payment must come to this contract
        verifyPayTxn(payment, {
            receiver: this.app.address,
        });
    
        // Optionally: Check that payment.amount >= vendor bid amount
        const vendorBid = this.vendorBids(this.selected_vendor.value).value;
        assert(payment.amount >= vendorBid.amount, "Insufficient funds sent.");
    
        this.depositedAmount.value += payment.amount;
    
        log("Funds deposited into contract escrow.");
    }

      confirm_dispatch(companyAddress: Address) : void{
        assert(this.txn.sender == this.selected_vendor.value, "Only the selected vendor can confirm delivery.");
        assert(globals.latestTimestamp <= this.deadline.value, "Delivery time has passed. Cannot confirm delivery.");
        assert(companyAddress == this.creator.value, "Only the company can confirm the delivery.");
        this.dispatch_date.value = globals.latestTimestamp 
        this.delivery_status.value = "dispatched"



      }

      confirm_delivery_received(): void {
        // Ensure that only the company can confirm the delivery
        assert(this.txn.sender == this.creator.value, "Only the company can confirm delivery received.");
        
        // Ensure the delivery hasn't already been marked as received or completed
        assert(this.delivery_status.value != "completed", "Order already completed.");
        
        // Mark the order as received (you can update a status variable or counter)  // Alternatively, use requestCounter or another field

        this.delivery_status.value = "completed"
    
        // If you have an escrow system, now is a good time to release the final payment or finalize the deal.
        // This logic can be added here if needed (transfer final payment to vendor, etc.)
    
        // Log the successful completion of the order
        log("Delivery received. The order is now completed and closed.");
    }
    
    cancel_request(): void {
      assert(this.txn.sender == this.creator.value, "Only the company can cancel the request.");
  
      const currentStatus = this.delivery_status.value;
  
      // Check if the delivery is already in progress or completed
      assert(
          currentStatus != "dispatch" && currentStatus != "completed" && currentStatus != "assigned",
          "The order cannot be canceled as it is already in progress or completed."
      );
  
      // If passed, cancel the request
      this.product.value = "";
      this.quantity.value = "";
      this.deadline.value = 0;
      this.max_budget.value = 0;
      this.selected_vendor.value = Address.zeroAddress;
  
      log("The purchase request has been canceled.");
  }

  receive_order(): void {
    assert(this.txn.sender == this.creator.value, "Only the company can confirm receiving the order.");
    assert(this.delivery_status.value == "dispatch", "Order has not been dispatched yet or already completed.");

    // Fetch selected vendor
    const vendor = this.selected_vendor.value;
    const bid = this.vendorBids(vendor).value;

    // Send the funds
    sendPayment({
        receiver: vendor,
        amount: bid.amount,
    });

    // Mark the order as completed
    this.delivery_status.value = "completed";

    log("Order received and payment released to vendor.");
}


}