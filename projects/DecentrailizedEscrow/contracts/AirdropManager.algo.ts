import { Contract } from '@algorandfoundation/tealscript'


type DropConfig = {

    assetID: uint64
    creatorAddress: Address
    tokenName : string
    amountRemaining: uint64
    numClaims: uint64
    maxClaims: uint64
    expiryDate: uint64
    amountToSend : uint64
    dropAppID: uint64
}

type EventID = uint64


export class AirdopManager extends Contract {

    maintainerAddress = GlobalStateKey<Address>({ key: 'maintainerAddress' })
    totalDrops = GlobalStateKey<uint64>({ key: 'totalDrops' })
    lastDropID = GlobalStateKey<uint64>();

    allDrops = BoxMap<EventID, DropConfig>()




    createApplication(maintainerAddress: Address): void {
        this.totalDrops.value = 0;
        this.maintainerAddress.value = maintainerAddress
        this.lastDropID.value = 0;
      }

      createDrop(dropConfig: DropConfig) : void {
        
        this.lastDropID.value += 1;
        this.totalDrops.value +=1;
        this.allDrops(this.lastDropID.value).value = dropConfig

        

      }

}