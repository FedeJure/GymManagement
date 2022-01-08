import { MockDb } from "../test/db";
import { getSubscriptions, saveSubscription } from ".";
import { InitProductOnDb, InitUserOnDb, MockSubscriptionPayload } from "../test/mocks";

const db = new MockDb();
beforeAll(async () => await db.connect());
beforeEach(async () => {
  await InitUserOnDb();
  await InitProductOnDb();
});
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Subscriptions", () => {
  it("get subscriptions on empty db", (done) => {
    getSubscriptions({ page: 0, step: 10 }).then((subscriptions) => {
      expect(subscriptions.length).toBe(0);
      done();
    });
  });

  it("save new subscription", (done) => {
    saveSubscription(MockSubscriptionPayload).then((subscription) => {
      expect(subscription?.user.id).toEqual(MockSubscriptionPayload.userId)
      expect(subscription?.product.id).toEqual(MockSubscriptionPayload.productId)
      expect(subscription?.initialTime.toISOString()).toEqual(MockSubscriptionPayload.initialTime.toISOString())
      expect(subscription?.endTime?.toISOString()).toEqual(MockSubscriptionPayload.endTime?.toISOString())
      done();
    });
  });
});
