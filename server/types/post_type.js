const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } =
  graphql;

const GraphQLObjectId = require("graphql-scalar-objectid");
const CommentType = require("./comment_type");
const Comments = require("../models/comments");
const User = require("../models/user");
const CompanyType = require("./company_type");

const PostType = new GraphQLObjectType({
  name: "PostType",
  fields: () => ({
    id: { type: GraphQLObjectId },
    /* -------------------------------------------------------------------------- */
    userId: {
      type: require("./user_type"),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.userId });
      },
    },
    /* -------------------------------------------------------------------------- */
    post: { type: GraphQLString },
    time: { type: GraphQLString },
    likedBy: {
      type: new GraphQLList(require("./user_type")),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return User.find({ _id: parentValue.likedBy });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        first: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return Comments.find({ postId: parentValue._id });
      },
    },
  }),
});

module.exports = PostType;
