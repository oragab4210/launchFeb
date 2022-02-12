const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } =
  graphql;
const GraphQLObjectId = require("graphql-scalar-objectid");
const UserType = require("./user_type");
const User = require("../models/user");

const CommentType = new GraphQLObjectType({
  name: "CommentType",
  fields: () => ({
    id: { type: GraphQLObjectId },
    postId: { type: GraphQLObjectId },
    userId: {
      type: require("./user_type"),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.userId });
      },
    },
    comment: { type: GraphQLString },
    likedBy: {
      type: new GraphQLList(require("./user_type")),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return User.find({ _id: parentValue.likedBy });
      },
    },
    time: { type: GraphQLString },
  }),
});

module.exports = CommentType;
