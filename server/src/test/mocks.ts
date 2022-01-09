import { ObjectId } from "mongodb";
import { Weekdays } from "../../../src/components/createProductModal/Weekdays";
import { PayType } from "../../../src/modules/product/PayType";
import { ProductPayload } from "../../../src/modules/product/ProductPayload";
import { SubscriptionPayload } from "../../../src/modules/subscription/SubscriptionPayload";
import { UserPayload } from "../../../src/modules/users/UserPayload";
import { UserType } from "../../../src/modules/users/UserType";
import { getProductModel, getUserModel } from "../mongoClient";
import { getNowDate } from "../utils/date";

export const MockUserId = new ObjectId();
export const MockBrotherIds = [
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
];
export const MockProductId = new ObjectId();

export const InitUserOnDb = async () => {
  const userModel = getUserModel();
  return userModel.create({ ...MockUserPayload, _id: MockUserId, id: MockUserId });
};

export const InitProductOnDb = async () => {
  const productModel = getProductModel();
  return await productModel.create({
    ...MockProductPayload,
    _id: MockProductId,
  });
};

export const InitBrothersOnDb = async (brothersCount: 1 | 2 | 3 | 4 | 5) => {
  const userModel = getUserModel();

  for (let i = 0; i < brothersCount; i++) {
    const brotherPayload = {
      type: UserType.STUDENT,
      name: "Brother " + i,
      lastname: "Mock Lastname",
      contactEmail: "mock@email.com",
      contactPhone: "99999999",
      address: "Fake address 123",
      birthDate: getNowDate(),
      comment: "Fake comment",
      familiars: [MockUserId],
      profilePicture: "",
      dni: "112333232",
    };
    const brother = await userModel.create({...brotherPayload, _id: MockBrotherIds[i]});
    const user = await userModel.findById(MockUserId);
    if (!user) return;
    await userModel.updateOne({
      _id: MockUserId,
      familiars: [...user.familiars, brother._id],
    });
  }
};

export const MockUserPayload: UserPayload = {
  type: UserType.STUDENT,
  name: "Mock User",
  lastname: "Mock Lastname",
  contactEmail: "mock@email.com",
  contactPhone: "99999999",
  address: "Fake address 123",
  birthDate: getNowDate(),
  comment: "Fake comment",
  familiars: [],
  profilePicture: "",
  dni: "112333232",
};

export const MockProductPayload: ProductPayload = {
  name: "Mock Product",
  payType: PayType.MONTHLY,
  price: 1000,
  twoSubscriptionsDiscount: 5,
  threeSubscriptionsDiscount: 10,
  fourSubscriptionsDiscount: 15,
  fiveOrMoreSubscriptionsDiscount: 20,
  daysInWeek: [Weekdays.Monday],
};

export const MockSubscriptionPayload: SubscriptionPayload = {
  userId: MockUserId.toString(),
  productId: MockProductId.toString(),
  specialDiscount: 0,
  initialTime: new Date(),
  comment: "comment",
};
