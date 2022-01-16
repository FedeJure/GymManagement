import { ObjectId } from "mongodb";
import { getOrders, getPayments, payOrder } from ".";
import { OrderStateEnum } from "../../../src/domain/order/OrderStateEnum";
import { getSubscriptionModel, getUserModel } from "../mongoClient";
import { MockDb } from "../test/db";
import { InitOrderOnDb, MockOrderId, MockOrderPayload } from "../test/mocks";

const db = new MockDb();
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clearDatabase());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Payments", () => {
  it("Try to do a payment on nonexistent order must fail", async () => {
    expect(async () => {
      await payOrder(new ObjectId().toString(), 1000);
    }).rejects.toThrowError();
  });

  it("do a payment to a existent non completed or canceled order", async () => {
    const amountToPay = 1000;
    await InitOrderOnDb(MockOrderPayload);

    let orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amountPayed).toEqual(0);
    let payments = await getPayments({ page: 0, step: 10 });
    expect(payments.length).toEqual(0);

    await payOrder(MockOrderId.toString(), amountToPay);

    orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amountPayed).toEqual(amountToPay);
    payments = await getPayments({ page: 0, step: 10 });
    expect(payments[0].amount).toEqual(amountToPay);
  });

  it("try to do a payment to a existent completed order", async () => {
    const amountToPay = 1000;
    await InitOrderOnDb({ ...MockOrderPayload, state: OrderStateEnum.COMPLETE });

    expect(async () => {
      await payOrder(MockOrderId.toString(), amountToPay);
    }).rejects.toThrowError();
  });

  it("try to do a payment to a existent cancelled order", async () => {
    const amountToPay = 1000;
    await InitOrderOnDb({ ...MockOrderPayload, state: OrderStateEnum.CANCELLED });

    expect(async () => {
      await payOrder(MockOrderId.toString(), amountToPay);
    }).rejects.toThrowError();
  });

  it("try to do a payment with excedent amount", async () => {
    const amountToPay = MockOrderPayload.amount + 1;
    await InitOrderOnDb({ ...MockOrderPayload });
    expect(async () => {
      await payOrder(MockOrderId.toString(), amountToPay);

    }).rejects.toThrowError();
  });

  it("do two payment to a existent non completed or canceled order", async () => {
    const amountToPay = 1000;
    await InitOrderOnDb(MockOrderPayload);
    await payOrder(MockOrderId.toString(), amountToPay);

    let orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amountPayed).toEqual(amountToPay);
    let payments = await getPayments({ page: 0, step: 10 });
    expect(payments[0].amount).toEqual(amountToPay);

    await payOrder(MockOrderId.toString(), amountToPay);

    orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amountPayed).toEqual(amountToPay * 2);
    payments = await getPayments({ page: 0, step: 10 });
    expect(payments[0].amount).toEqual(amountToPay);
    expect(payments[1].amount).toEqual(amountToPay);
  });

  it("complete payment after pay all the remaining amount", async () => {
    const amountToPay = MockOrderPayload.amount;
    await InitOrderOnDb(MockOrderPayload);

    await payOrder(MockOrderId.toString(), amountToPay);

    let orders = await getOrders({ page: 0, step: 10 });
    expect(orders[0].amountPayed).toEqual(amountToPay);
    expect(orders[0].state).toEqual(OrderStateEnum.COMPLETE);
    let payments = await getPayments({ page: 0, step: 10 });
    expect(payments[0].amount).toEqual(amountToPay);
  });

  it("set pending pay to false on user", async () => {
    const userModel = getUserModel();

    const amountToPay = MockOrderPayload.amount / 3;
    await InitOrderOnDb(MockOrderPayload);
    await payOrder(MockOrderId.toString(), amountToPay);
    await payOrder(MockOrderId.toString(), amountToPay);

    let user = await userModel.findById(MockOrderPayload.userId);
    if (user) {
      expect(user.pendingPay).toBeTruthy();
    }

    await payOrder(MockOrderId.toString(), amountToPay);

    user = await userModel.findById(MockOrderPayload.userId);
    if (user) {
      expect(user.pendingPay).toBeFalsy();
    }
  });

  it("set pending pay to false on subscription", async () => {
    const subscriptionModel = getSubscriptionModel();

    const amountToPay = MockOrderPayload.amount / 3;
    await InitOrderOnDb(MockOrderPayload);
    await payOrder(MockOrderId.toString(), amountToPay);
    await payOrder(MockOrderId.toString(), amountToPay);

    let subscription = await subscriptionModel.findById(MockOrderPayload.subscriptionId);
    if (subscription) {
      expect(subscription.pendingPay).toBeTruthy();
    }

    await payOrder(MockOrderId.toString(), amountToPay);

    subscription = await subscriptionModel.findById(MockOrderPayload.subscriptionId);
    if (subscription) {
      expect(subscription.pendingPay).toBeFalsy();
    }
  });
});
