import { Contract } from '@algorandfoundation/tealscript'

type EventConfig = {

  EventID: uint64
  EventName: string
  EventCategory : string
  EventCreator: Address
  EventImage: string
  EventCost: uint64
  MaxParticipants: uint64
  Location: string
  StartTime: uint64
  EndTime : uint64
  RegisteredCount: uint64
  EventAppID: uint64
}

type EventID = uint64

export type AddressClaimKey = {
    // we want token drop id first so we can do box fetches by prefix - getting all claims per drop
    EventID: uint64
    Address: Address
}

type TxnId = bytes32



export class Ticket  extends Contract {


    creatorAddress = GlobalStateKey<EventConfig["EventCreator"]>({ key: 'creatorAddress' })
    eventName = GlobalStateKey<EventConfig["EventName"]>({ key: 'eventName' })
    location = GlobalStateKey<EventConfig["Location"]>({ key: 'location' })
    startTime = GlobalStateKey<EventConfig["StartTime"]>({ key: 'startTime' })
    endTime = GlobalStateKey<EventConfig["EndTime"]>({ key: 'endTime' })
    registeredCount = GlobalStateKey<EventConfig["RegisteredCount"]>({ key: 'registeredCount' })
    eventCost = GlobalStateKey<EventConfig["EventCost"]>({ key: 'eventCost' })

    assetID = GlobalStateKey<uint64>({ key: 'assetID' })
    ticketsRemaining = GlobalStateKey<uint64>();

    registeredMap = BoxMap<Address, string>()


    createApplication(eventName: string, location: string, startTime: uint64, endTime: uint64, eventCost: uint64, ticketsRemaining: uint64): void {
        
        this.creatorAddress.value = this.txn.sender;
        this.eventName.value = eventName
        this.location.value = location
        this.endTime.value = endTime
        this.registeredCount.value = 0
        this.startTime.value = startTime
      this.eventCost.value = eventCost
      this.ticketsRemaining.value = ticketsRemaining




      }


      createTickets(assetUrl : string, totalTickets: uint64): void {

assert(this.txn.sender == this.app.creator, "Only The Event Creator can Mint Tickets")

                
        const itxnResult = sendAssetCreation({
            configAssetTotal: totalTickets,  // Use configAssetTotal instead of total
            configAssetDecimals: 0,      // Use configAssetDecimals instead of decimals
            configAssetUnitName: "TCKT",  // Use configAssetUnitName instead of unitName
            configAssetName: this.eventName.value, // Use configAssetName instead of assetName
            configAssetURL : assetUrl,
            fee: 3000,



      })

      this.assetID.value = itxnResult.id

    }





      registerEvent (email: string ): void {
        

        assert(!this.registeredMap(this.txn.sender).exists, 'already claimed')
        this.registeredCount.value += 1
        this.registeredMap(this.txn.sender).value = email;




        this.sendTickets(1,this.txn.sender);
      }






      withDrawFunds (funds : uint64 ): void {
        

        sendPayment({amount: funds,note: "Withdrawn Funds from Ticket Contract"})
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
    private sendTickets(amountToSend: uint64,receiver:Address): uint64 {
      sendAssetTransfer({
          xferAsset: AssetID.fromUint64(this.assetID.value),
          assetReceiver: receiver,
          assetAmount: amountToSend,
      })

      // make sure we track the latest balance for what was just claimed by user
      const remaining = this.ticketsRemaining.value - amountToSend

      return remaining
  }







}