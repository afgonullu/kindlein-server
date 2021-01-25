export const childDefs = `#graphql
  type Child {
    id: ID!
    name: String!
    birthDate: String!
    createdAt: String!
    createdBy: User!
    #parent: String
    moments: [Moment]!
  }

  input ChildInput {
    name: String!
    birthDate: String!
    #parent: String
  }

  type ChildResponse {
    success: Boolean!
    message: String
    child: Child!
    moments: [Moment]
  }
  
  extend type Query {
    children(userId: ID!): [Child]!
    child(id: ID!): Child
  }

  extend type Mutation {
    addChild(childInput: ChildInput!): ChildResponse!
    deleteChild(childId: ID!): ChildResponse!
    updateChild(childId: ID!, updateChildInput: ChildInput!): Child!
  }
`;
