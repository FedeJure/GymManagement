import { MockDb } from "../test/db";
import {
  generateNewPayOrdersIfNeeded,
  getSubscriptions,
  saveSubscription,
} from ".";
import {
  InitBrothersOnDb,
  InitProductOnDb,
  InitUserOnDb,
  MockSubscriptionPayload,
} from "../test/mocks";
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload";
import { getOrders } from "../pay";
import { mockNextDate, resetMockDate } from "../utils/date";

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
      expect(subscription?.user.id).toEqual(MockSubscriptionPayload.userId);
      expect(subscription?.product.id).toEqual(
        MockSubscriptionPayload.productId
      );
      expect(subscription?.initialTime.toISOString()).toEqual(
        MockSubscriptionPayload.initialTime.toISOString()
      );
      expect(subscription?.endTime?.toISOString()).toEqual(
        MockSubscriptionPayload.endTime?.toISOString()
      );
      done();
    });
  });

  it("No order created on subscription with future initial time", (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now() + 10000000),
    };
    saveSubscription(mockSubscriptionPayload).then((_) => {
      getOrders({ page: 0, step: 10 }).then((orders) => {
        expect(orders.length).toBe(0);
        done();
      });
    });
  });

  it("order created on subscription with initial time started", (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };
    saveSubscription(mockSubscriptionPayload).then((subscription) => {
      getOrders({ page: 0, step: 10 }).then((orders) => {
        expect(orders.length).toBe(1);
        expect(orders[0].subscriptionId.toString()).toEqual(
          subscription?.id.toString()
        );
        expect(orders[0].productId.toString()).toEqual(
          subscription?.product.id.toString()
        );
        expect(orders[0].userId.toString()).toEqual(
          subscription?.user.id.toString()
        );
        done();
      });
    });
  });

  it("create order without discount", (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };
    saveSubscription(mockSubscriptionPayload).then((subscription) => {
      getOrders({ page: 0, step: 10 }).then((orders) => {
        expect(orders[0].amount).toEqual(subscription?.product.price);
        done();
      });
    });
  });

  it("create order with special discount", (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
      specialDiscount: 5, // percent
    };
    saveSubscription(mockSubscriptionPayload).then((subscription) => {
      getOrders({ page: 0, step: 10 }).then((orders) => {
        expect(orders[0].amount).toEqual(
          (subscription?.product.price || 0) * 0.95
        );
        done();
      });
    });
  });

  it("create order with one brother", (done) => {
    InitBrothersOnDb(1).then(() => {
      const mockSubscriptionPayload: SubscriptionPayload = {
        ...MockSubscriptionPayload,
        initialTime: new Date(Date.now()),
      };
      saveSubscription(mockSubscriptionPayload).then((subscription) => {
        getOrders({ page: 0, step: 10 }).then((orders) => {
          expect(orders[0].amount).toEqual(
            (subscription?.product.price || 0) * 0.95
          );
          done();
        });
      });
    });
  });

  it("create order with two brothers", (done) => {
    InitBrothersOnDb(2).then(() => {
      const mockSubscriptionPayload: SubscriptionPayload = {
        ...MockSubscriptionPayload,
        initialTime: new Date(Date.now()),
      };
      saveSubscription(mockSubscriptionPayload).then((subscription) => {
        getOrders({ page: 0, step: 10 }).then((orders) => {
          expect(orders[0].amount).toEqual(
            (subscription?.product.price || 0) * 0.9
          );
          done();
        });
      });
    });
  });

  it("create order with three brothers", (done) => {
    InitBrothersOnDb(3).then(() => {
      const mockSubscriptionPayload: SubscriptionPayload = {
        ...MockSubscriptionPayload,
        initialTime: new Date(Date.now()),
      };
      saveSubscription(mockSubscriptionPayload).then((subscription) => {
        getOrders({ page: 0, step: 10 }).then((orders) => {
          expect(orders[0].amount).toEqual(
            (subscription?.product.price || 0) * 0.85
          );
          done();
        });
      });
    });
  });

  it("create order with four brothers", (done) => {
    InitBrothersOnDb(4).then(() => {
      const mockSubscriptionPayload: SubscriptionPayload = {
        ...MockSubscriptionPayload,
        initialTime: new Date(Date.now()),
      };
      saveSubscription(mockSubscriptionPayload).then((subscription) => {
        getOrders({ page: 0, step: 10 }).then((orders) => {
          expect(orders[0].amount).toEqual(
            (subscription?.product.price || 0) * 0.8
          );
          done();
        });
      });
    });
  });

  it("create order with max discount applied", (done) => {
    InitBrothersOnDb(4).then(() => {
      const mockSubscriptionPayload: SubscriptionPayload = {
        ...MockSubscriptionPayload,
        initialTime: new Date(Date.now()),
        specialDiscount: 30,
      };
      saveSubscription(mockSubscriptionPayload).then((subscription) => {
        getOrders({ page: 0, step: 10 }).then((orders) => {
          expect(orders[0].amount).toEqual(
            (subscription?.product.price || 0) * 0.7
          );
          done();
        });
      });
    });
  });

  it("Generate pay order after subscription creation", (done) => {
    const date = new Date(2021, 1, 2);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: date,
    };
    mockNextDate(new Date(new Date(2021,1,1)));
    saveSubscription(mockSubscriptionPayload).then((_) => {
      getOrders({ page: 0, step: 10 }).then((orders) => {
        expect(orders.length).toBe(0);
        mockNextDate(new Date(new Date(2021,1,3)));

        generateNewPayOrdersIfNeeded().then(() => {
          getOrders({ page: 0, step: 10 }).then((newOrders) => {
            expect(newOrders.length).toBe(1);
            resetMockDate();
            done();
          });
        });
      });
    });
  });
});
