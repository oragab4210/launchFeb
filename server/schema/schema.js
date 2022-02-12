const graphql = require("graphql");
const { GraphQLSchema } = graphql;

const RootQueryType = require("../types/root_query_types");
const mutation = require("./mutations");

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: mutation,
});
