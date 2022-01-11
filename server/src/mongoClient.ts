import { Schema, Types, Model } from "mongoose";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import { User } from "../../src/modules/users/User";
import { Product } from "../../src/modules/product/Product";
import { Subscription } from "../../src/modules/subscription/Subscription";
import { PayRecipe } from "../../src/modules/payRecipe/PayRecipe";
import { Order } from "../../src/modules/order/Order";
import { getNowDate } from "./utils/date";

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
    type: String,
    name: String,
    lastname: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    birthDate: Date,
    comment: String,
    familiars: [Types.ObjectId], //refactorizar y referenciar user directamente
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
  });
  mongoose.model("Product", ProductSchema);

  const SubscriptionSchema = new Schema<Subscription>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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
    completed: Boolean,
    cancelled: Boolean,
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

if (mocked) {
  mockMongoose
    .prepareStorage()
    .then(function () {
      mongoose.connect(url);
      mongoose.connection.on("connected", () => {
        console.log("CONNECTED MOCK DB");
      });
      createSchemas();
    })
    .catch(console.log);
} else {
  mongoose.connect(url);
  createSchemas();
}
