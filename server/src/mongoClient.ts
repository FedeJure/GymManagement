import  { Schema, Types, Model } from "mongoose"
import mongoose from "mongoose"
import  { MockMongoose } from "mock-mongoose"
import { User } from "../../src/modules/users/User";
import { Product } from "../../src/modules/product/Product";
import { Subscription } from "../../src/modules/subscription/Subscription";

const mockMongoose = new MockMongoose(mongoose)
const dbName = 'gymManagement';
const url = 'mongodb://localhost:27017/' + dbName;


mockMongoose.prepareStorage().then(function () {
  mongoose.connect(url);
  createSchemas()
});

export const getClient = () => {

  return mongoose
}

export const getUserModel = () : Model<User,any,any> => {
  return mongoose.model("User")
}

export const getProductModel = (): Model<Product,any,any> => {
  return mongoose.model("Product")
}

export const getSubscriptionModel = (): Model<Subscription,any,any> => {
  return mongoose.model("Subscription")
}

const createSchemas = () => {
  const UserSchema = new Schema({
    type: String,
    name: String,
    lastname: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    birthDate: Date,
    comment: String,
    brothers: [Types.ObjectId],
    profilePicture: String,
    dni: String,
    creationDate: { type: Date, default: Date.now }
  });

  mongoose.model("User", UserSchema)

  const ProductSchema = new Schema({
    name: String,
    payType: String,
    price: Number,
    daysInWeek: [String],
    creationDate: { type: Date, default: Date.now }
  });
  mongoose.model("Product", ProductSchema)

  const SubscriptionSchema = new Schema({
    userId: Number,
    productId: Number,
    initialTime: Number,
    endTime: Number,
    creationDate: { type: Date, default: Date.now }
  })
  mongoose.model("Subscription", SubscriptionSchema)

  return []
}
