import { Contract } from '@algorandfoundation/tealscript'

type EventConfig = {

    EventID: uint64
    EventName: string
    EventCreator: Address
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
export class Event  extends Contract {


    creatorAddress = GlobalStateKey<EventConfig["EventCreator"]>({ key: 'creatorAddress' })
    eventName = GlobalStateKey<EventConfig["EventName"]>({ key: 'eventName' })
    location = GlobalStateKey<EventConfig["Location"]>({ key: 'location' })
    startTime = GlobalStateKey<EventConfig["StartTime"]>({ key: 'startTime' })
    endTime = GlobalStateKey<EventConfig["EndTime"]>({ key: 'endTime' })
    registeredCount = GlobalStateKey<EventConfig["RegisteredCount"]>({ key: 'registeredCount' })

    registeredMap = BoxMap<Address, TxnId>({ prefix: 'c' })


    createApplication(eventName: string, location: string, startTime: uint64, endTime: uint64): void {
        
        this.creatorAddress.value = this.txn.sender;
        this.eventName.value = eventName
        this.location.value = location
        this.endTime.value = endTime
        this.registeredCount.value = 0
        this.startTime.value = startTime


      }

      registerEvent ( ): void {
        

        assert(!this.registeredMap(this.txn.sender).exists, 'already claimed')
        this.registeredCount.value += 1
        this.registeredMap(this.txn.sender).value = this.txn.txID as bytes32
      }


}