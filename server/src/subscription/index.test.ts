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
import { SubscriptionPayload } from "../../../src/domain/subscription/SubscriptionPayload";
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
  it("get subscriptions on empty db", async (done) => {
    const subscriptions = await getSubscriptions({ page: 0, step: 10 });
    expect(subscriptions.length).toBe(0);
    done();
  });

  it("save new subscription", async (done) => {
    const savedSubscription = await saveSubscription(MockSubscriptionPayload);
    expect(savedSubscription?.user.id).toEqual(MockSubscriptionPayload.userId);
    expect(savedSubscription?.product.id).toEqual(
      MockSubscriptionPayload.productId
    );
    expect(savedSubscription?.initialTime.toISOString()).toEqual(
      MockSubscriptionPayload.initialTime.toISOString()
    );
    expect(savedSubscription?.endTime?.toISOString()).toEqual(
      MockSubscriptionPayload.endTime?.toISOString()
    );
    done();
  });

  it("No order created on subscription with future initial time", async (done) => {
    mockNextDate(new Date(2021, 1, 3))

    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(2021, 1, 4),
    };
    await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(0);
    resetMockDate()
    done();
  });

  it("order created on subscription with initial time started", async (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };
    const savedSubscription = await saveSubscription(mockSubscriptionPayload);

    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(1);
    expect(orders[0].subscriptionId.toString()).toEqual(
      savedSubscription?.id.toString()
    );
    expect(orders[0].productId.toString()).toEqual(
      savedSubscription?.product.id.toString()
    );
    expect(orders[0].userId.toString()).toEqual(
      savedSubscription?.user.id.toString()
    );
    done();
  });

  it("create order without discount", async (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };
    const savedSubscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });

    expect(orders[0].amount).toEqual(savedSubscription?.product.price);
    done();
  });

  it("create order with special discount", async (done) => {
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
      specialDiscount: 5, // percent
    };
    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.95);
    done();
  });

  it("create order with one brother", async (done) => {
    await InitBrothersOnDb(1);

    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };
    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.95);
    done();
  });

  it("create order with two brothers", async (done) => {
    await InitBrothersOnDb(2);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };

    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.9);
    done();
  });

  it("create order with three brothers", async (done) => {
    await InitBrothersOnDb(3);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };

    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });

    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.85);
    done();
  });

  it("create order with four brothers", async (done) => {
    await InitBrothersOnDb(4);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
    };

    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });

    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.8);
    done();
  });

  it("create order with max discount applied", async (done) => {
    await InitBrothersOnDb(4);

    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: new Date(Date.now()),
      specialDiscount: 30,
    };
    const subscription = await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amount).toEqual((subscription?.product.price || 0) * 0.7);
    done();
  });

  it("Generate pay order after subscription creation", async (done) => {
    const date = new Date(2021, 1, 2);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: date,
    };
    mockNextDate(new Date(new Date(2021, 1, 1)));
    await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(0);
    mockNextDate(new Date(new Date(2021, 1, 3)));

    await generateNewPayOrdersIfNeeded()
    var newOrders = await getOrders({ page: 0, step: 10 });
    expect(newOrders.length).toBe(1);
    resetMockDate();
    done();
  });

  it("Generate only one pay order after subscription creation", async (done) => {
    const date = new Date(2021, 1, 2);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: date,
    };
    mockNextDate(new Date(new Date(2021, 1, 1)));
    await saveSubscription(mockSubscriptionPayload);
    const orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(0);
    mockNextDate(new Date(new Date(2021, 1, 3)));

    await generateNewPayOrdersIfNeeded()
    await generateNewPayOrdersIfNeeded()
    var newOrders = await getOrders({ page: 0, step: 10 });
    expect(newOrders.length).toBe(1);
    resetMockDate();
    done();
  });

  it("Generate next pay order after a moth pass", async (done) => {
    const date = new Date(2021, 1, 2);
    const mockSubscriptionPayload: SubscriptionPayload = {
      ...MockSubscriptionPayload,
      initialTime: date,
    };
    mockNextDate(new Date(2021, 1, 3));
    await saveSubscription(mockSubscriptionPayload);
    let orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(1);

    mockNextDate(new Date(2021, 1, 28));
    await generateNewPayOrdersIfNeeded()

    orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(1);

    mockNextDate(new Date(2021, 2, 1));
    await generateNewPayOrdersIfNeeded()

    orders = await getOrders({ page: 0, step: 10 });
    expect(orders.length).toBe(2);
    resetMockDate();
    done();
  });
});
