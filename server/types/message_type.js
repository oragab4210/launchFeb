const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const MessageType = new GraphQLObjectType({
  name: "MessageType",
  fields: () => ({
    convoId: { type: GraphQLID },
    messages: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "messages",
          fields: {
            senderId: { type: GraphQLID },
            body: { type: GraphQLString },
          },
        })
      ),
    },
  }),
});

module.exports = MessageType;
