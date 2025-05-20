import { Contract } from '@algorandfoundation/tealscript';


type EventID = uint64


type EventConfig = {

    EventID: uint64
    EventName: string
    EventCategory : string
    EventCreator: Address
    EventImage: string
    MaxParticipants: uint64
    Location: string
    StartTime: uint64
    EndTime : uint64
    RegisteredCount: uint64
    EventAppID: uint64
}
export class TicketManager extends Contract {


    maintainerAddress = GlobalStateKey<Address>({ key: 'maintainerAddress' })
    totalEvents = GlobalStateKey<uint64>({ key: 'totalEvents' })
    lastEventID = GlobalStateKey<uint64>();



    allEvents = BoxMap<EventID, EventConfig>()

    createApplication(maintainerAddress: Address): void {
        this.totalEvents.value = 0;
        this.maintainerAddress.value = maintainerAddress
        this.lastEventID.value = 1;
      }

      createEvent(eventConfig: EventConfig): void {
        const newEvent: EventConfig = {
            EventID: this.lastEventID.value,
            EventName: eventConfig.EventName,
            EventCategory: eventConfig.EventCategory,
            EventCreator: eventConfig.EventCreator,
            EventImage: eventConfig.EventImage,
            MaxParticipants: eventConfig.MaxParticipants,
            Location: eventConfig.Location,
            StartTime: eventConfig.StartTime,
            EndTime: eventConfig.EndTime,
            RegisteredCount: eventConfig.RegisteredCount,
            EventAppID: eventConfig.EventAppID
            
        };
    
        this.allEvents(this.lastEventID.value).value = newEvent;
        this.lastEventID.value += 1;
        this.totalEvents.value += 1;
    }
    


      deleteEvent(eventID: uint64 ): void{

        assert(this.txn.sender == this.app.creator)

        
        this.allEvents(eventID).delete()




      }


      updateEvent(): void{


        

      }



}