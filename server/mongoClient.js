// const MongoClient = require('mongodb').MongoClient; //For real database
const MongoClient = require('mongo-mock').MongoClient; //For mock in-memory database
const assert = require('assert');

const { Schema, Types } = require("mongoose")
const mongoose = require("mongoose")
const { MockMongoose } = require("mock-mongoose")
const mockMongoose = new MockMongoose(mongoose)
const dbName = 'gymManagement';
const url = 'mongodb://localhost:27017/' + dbName;

var mongoClient = null;

mockMongoose.prepareStorage().then(function () {
  mongoose.connect(url);
  createSchemas()
});

exports.getClient = () => {

  return mongoose
}

exports.getUserModel = () => {
  return mongoose.model("User")
}

exports.getProductModel = () => {
  return mongoose.model("Product")
}

exports.getSubscriptionModel = () => {
  return mongoose.model("Subscription")
}

const createSchemas = () => {
  const UserSchema = new Schema({
    _id: Types.ObjectId,
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
    _id: Types.ObjectId,
    name: String,
    payType: String,
    price: Number,
    daysInWeek: [String],
    creationDate: { type: Date, default: Date.now }
  });
  mongoose.model("Product", ProductSchema)

  const SubscriptionSchema = new Schema({
    _id: Types.ObjectId,
    userId: Number,
    productId: Number,
    initialTime: Number,
    endTime: Number,
    creationDate: { type: Date, default: Date.now }
  })
  mongoose.model("Subscription", SubscriptionSchema)

  return []
}
  // return new Promise((res, err) => {
  //   if (mongoClient != null) {
  //     res(mongoClient);
  //     return;
  //   }

  //   try {
  //     MongoClient.connect(url, {}, function(initError, client) {
  //       assert.strictEqual(null, initError);
  //       console.log("Connected successfully to server Mongod");
  //       const db = client.db();
  //       mongoClient = db;
  //       res(db);
  //     });
  //   } catch (error) {
  //     err(error);
  //   }
  // })
