import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { algos } from '@algorandfoundation/algokit-utils';
import { MarketServiceClient } from '../contracts/clients/MarketServiceClient';
const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });
import * as algosdk from 'algosdk';

let appClient: MarketServiceClient;

describe('EscrowService', () => {
  beforeEach(fixture.beforeEach);

  let boss: string;
  let worker: string;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algorand } = fixture;
    const { testAccount: bossAccount, testAccount: workerAccount } = fixture.context;
    boss = bossAccount.addr;
    worker = workerAccount.addr;
    const adminAddress = 'KK45KH6PIPO7FXGMETBJ5FC3BJ7KYRU4NTT65H5VISFDU5DIYYMDGH6C3M';

    appClient = new MarketServiceClient(
      {
        sender: bossAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    await appClient.create.createApplication({
      worker,
      adminAddress,
    });
  });

  test('addFundsToEscrow', async () => {
    const { algorand } = fixture;
    

    const algorandClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "443")
    const admin = algosdk.mnemonicToSecretKey(
        'honey ignore theory shift math cereal rotate limit sample tourist tide group high sad tilt clap often photo gesture oppose tool harvest relax above require'
      );
    const Caller = new MarketServiceClient(
        {
          sender: admin,
          resolveBy: 'id',
          id: 0,
        },
        algorandClient
      );
      await Caller.create.createApplication({worker: "4O3LMQFK2B7YLNPBOM36JAC4WXUIFWSNYWKCG2WARWLYU3HCORKSJOYMS4",adminAddress:"3FRGAL3WV46LP5H45L267DMCSSUWKQQLT4XFDYKSRIJBOJE6H5XEJMLK3Y"});
      const { appId, appAddress } = await Caller.appClient.getAppReference();
      console.log('APP ID : ', appId);
      console.log('APP ADDRESS : ', appAddress);


  });

  
});
