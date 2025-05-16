import { Contract } from '@algorandfoundation/tealscript'


type EventConfig = {

    EventID: uint64
    EventName: string
    EventCategory : string
    EventCreator: Address
    MaxParticipants: uint64
    Location: string
    StartTime: uint64
    EndTime : uint64
    RegisteredCount: uint64
    EventAppID: uint64
}

type EventID = uint64


export class EventManager extends Contract {

    maintainerAddress = GlobalStateKey<Address>({ key: 'maintainerAddress' })
    totalEvents = GlobalStateKey<uint64>({ key: 'totalEvents' })
    lastEventID = GlobalStateKey<uint64>();

    allEvents = BoxMap<EventID, EventConfig>({ prefix: 'e' })

    createApplication(maintainerAddress: Address): void {
        this.totalEvents.value = 0;
        this.maintainerAddress.value = maintainerAddress
        this.lastEventID.value = 0;
      }

      createEvent(eventConfig: EventConfig) : void {
        
        this.lastEventID.value += 1;
        this.totalEvents.value +=1;
        this.allEvents(this.lastEventID.value).value = eventConfig

        

      }





}

