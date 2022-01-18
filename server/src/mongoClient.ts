import { Schema, Types, Model, Collection, SchemaTypes } from "mongoose";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import { User } from "../../src/domain/users/User";
import { Product } from "../../src/domain/product/Product";
import { Subscription } from "../../src/domain/subscription/Subscription";
import { PayRecipe } from "../../src/domain/payRecipe/PayRecipe";
import { Order } from "../../src/domain/order/Order";
import { getNowDate } from "./utils/date";
import { ObjectId } from "mongodb";
import { UserType } from "../../src/domain/users/UserType";
import { OrderStateEnum } from "../../src/domain/order/OrderStateEnum";

const mocked = false; // This actually is not working if true, I dont know why

const mockMongoose = new MockMongoose(mongoose);
const dbName = "gymManagement";
const url = "mongodb://localhost:27017/" + dbName;

export const getClient = () => {
  return mongoose;
};

export const getUserModel = (): Model<User> => {
  return mongoose.model("User");
};

export const getProductModel = (): Model<Product> => {
  return mongoose.model("Product");
};

export const getSubscriptionModel = (): Model<Subscription> => {
  return mongoose.model("Subscription");
};

export const getOrderModel = (): Model<Order> => {
  return mongoose.model("Order");
};

export const getPayRecipeModel = (): Model<PayRecipe> => {
  return mongoose.model("PayRecipe");
};

const createSchemas = () => {
  const UserSchema = new Schema<User>({
    id: String,
    type: String,
    name: String,
    lastname: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    birthDate: Date,
    comment: String,
    familiars: [{ type: [mongoose.Schema.Types.ObjectId], ref: "User" }], //refactorizar y referenciar user directamente
    profilePicture: String,
    dni: String,
    creationDate: { type: Date, default: getNowDate },
    pendingPay: { type: Boolean, default: false },
  });

  mongoose.model("User", UserSchema);

  const ProductSchema = new Schema<Product>({
    name: String,
    payType: String,
    price: Number,
    daysInWeek: [String],
    twoSubscriptionsDiscount: Number,
    threeSubscriptionsDiscount: Number,
    fourSubscriptionsDiscount: Number,
    fiveOrMoreSubscriptionsDiscount: Number,
    creationDate: { type: Date, default: getNowDate },
    owners: [{ type: [Types.ObjectId], ref: "User" }],
  });
  mongoose.model("Product", ProductSchema);

  const SubscriptionSchema = new Schema<Subscription>({
    user: { type: Types.ObjectId, ref: "User" },
    product: { type: SchemaTypes.ObjectId, ref: "Product" },
    initialTime: Date,
    endTime: Date,
    specialDiscount: Number,
    creationDate: { type: Date, default: getNowDate },
    dateOfNextPayOrder: Date,
    pendingPay: { type: Boolean, default: false },
  });

  mongoose.model("Subscription", SubscriptionSchema);

  const OrderSchema = new Schema<Order>({
    id: Types.ObjectId,
    userId: Types.ObjectId,
    userName: String,
    productId: Types.ObjectId,
    productName: String,
    basePrice: Number,
    totalDiscount: Number,
    amount: Number,
    emittedDate: Date,
    periodPayed: Date,
    state: { type: String, default: OrderStateEnum.AVAILABLE},
    amountPayed: Number,
    subscriptionId: Types.ObjectId,
  });
  mongoose.model("Order", OrderSchema);

  const PayRecipeSchema = new Schema<PayRecipe>({
    id: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: Number,
    emittedDate: Date,
  });
  mongoose.model("PayRecipe", PayRecipeSchema);

  return [];
};
createSchemas();

if (mocked) {
  mockMongoose
    .prepareStorage()
    .then(function () {
      mongoose.connect(url + "mock");
      mongoose.connection.on("connected", () => {
        console.log("CONNECTED MOCK DB");
      });
      createSchemas();
    })
    .catch(console.log);
} else {
  if (process.env.NODE_ENV !== "test") {
    mongoose.connect(url);
  }
}
