import { Contract } from '@algorandfoundation/tealscript'

type EventConfig = {

    EventID: uint64
    EventName: string
    EventCreator: Address
    MaxParticipants: uint64
    Location: string
    StartTime: uint64
    EndTime : uint64
    RegisteredCount: uint64
}

type EventID = uint64

export type AddressClaimKey = {
    EventID: uint64
    Address: Address
}

export type ClaimedInfo = {
    TxnId: bytes32
}
export class Events extends Contract {


    maintainerAddress = GlobalStateKey<Address>({ key: 'maintainerAddress' })
    totalEvents = GlobalStateKey<uint64>({ key: 'totalEvents' })
    lastEventId = GlobalStateKey<EventID>({ key: 'lastDropId' })

    allEvents = BoxMap<EventID, EventConfig>({ prefix: 'e' })

    participantsMap = BoxMap<AddressClaimKey, ClaimedInfo>({ prefix: 'c' })

    createApplication( maintainerAddress: Address): void {
        this.maintainerAddress.value = maintainerAddress
        this.totalEvents.value = 0
        this.lastEventId.value = 0
    }

    createEvent(feeAndMbrPayment: PayTxn,eventConfig: EventConfig): uint64  {
        verifyPayTxn(feeAndMbrPayment, { receiver: this.app.address })



        assert(eventConfig.EndTime >= globals.latestTimestamp, "event endtime must be in future")
                assert(eventConfig.StartTime >= globals.latestTimestamp, "event start time must be in future")

this.lastEventId.value += 1
        const eventID = this.lastEventId.value

 this.allEvents(this.lastEventId.value).value = eventConfig



 return eventID
    }

claimEvent (feeAndMbrPayment: PayTxn, eventID : EventID ) :void { 

        verifyPayTxn(feeAndMbrPayment, { receiver: this.app.address })
    const eventInfo = this.allEvents(eventID).value

        assert(this.txn.sender !== eventInfo.EventCreator, 'drop creator cannot claim')
                const claimKey = { EventID: eventID, Address: this.txn.sender } as AddressClaimKey

                assert(!this.participantsMap(claimKey).exists, 'already claimed')
                   this.participantsMap(claimKey).value = { TxnId: this.txn.txID as bytes32 } 

this.allEvents(eventID).value.RegisteredCount += 1;

}


}