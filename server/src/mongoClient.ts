import  { Schema, Types, Model } from "mongoose"
import mongoose from "mongoose"
import  { MockMongoose } from "mock-mongoose"

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

export const getUserModel = () : Model<any,any,any> => {
  return mongoose.model("User")
}

export const getProductModel = (): Model<any,any,any> => {
  return mongoose.model("Product")
}

export const getSubscriptionModel = (): Model<any,any,any> => {
  return mongoose.model("Subscription")
}

const createSchemas = () => {
  const UserSchema = new Schema({
    id: Types.ObjectId,
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
    id: Types.ObjectId,
    name: String,
    payType: String,
    price: Number,
    daysInWeek: [String],
    creationDate: { type: Date, default: Date.now }
  });
  mongoose.model("Product", ProductSchema)

  const SubscriptionSchema = new Schema({
    id: Types.ObjectId,
    userId: Number,
    productId: Number,
    initialTime: Number,
    endTime: Number,
    creationDate: { type: Date, default: Date.now }
  })
  mongoose.model("Subscription", SubscriptionSchema)

  return []
}
