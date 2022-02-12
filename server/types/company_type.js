const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;

const CompanyType = new GraphQLObjectType({
  name: "CompanyType",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

module.exports = CompanyType;
