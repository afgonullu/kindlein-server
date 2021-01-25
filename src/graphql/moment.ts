export const moments = [
  {
    id: 1,
    date: "2014-03-22",
    title: "born today",
    description: "my boy born this day around 17:30",
    location: "frankfurt am main",
    tags: ["magical", "historic"],
  },
  {
    id: 2,
    date: "2016-10-16",
    title: "learned about dragons",
    description: "Sümkürdükten sonra, anne genau wie eine drache dimi?",
    location: "ankara",
    tags: ["funny"],
  },
  {
    id: 3,
    date: "2017-05-08",
    title: "sohbet etmeyi öğrenmiş",
    description: "Rümüye diyor ki: yumü şobbet edelim mi; Ben muhammed mirza gönüllü 3 yaşındayım şen kaç yaşındasın",
    location: "ankara",
    tags: ["funny", "historic"],
  },
];

export const momentDefs = `#graphql
  #type Tag {
  #  id: ID!
  #  body: String!
  #  createdAt: String!
  #  moments: [Moment]!
  #}

  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  extend type Moment {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
    createdBy: User!
    belongsTo: Child!
    momentDate: String!
    location: String!
    #tags: [Tag]!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  input MomentInput {
    title: String!
    body: String!
    childId: String!
    momentDate: String!
    location: String!
    #tags: [String]!
  }

  type MomentResponse {
    success: Boolean!
    message: String
    moment: Moment
    child: Child
    #tags: [Tag]
  }
  
  extend type Query {
    moments: [Moment]!
    moment(id: ID!): Moment
  }

  extend type Mutation {
    addMoment(momentInput: MomentInput!): MomentResponse!
    deleteMoment(id: ID!): MomentResponse!
    likeMoment(id: ID!): MomentResponse!
    addComment(id: ID!, body: String!): MomentResponse!
    deleteComment(id: ID!, momentId: ID!): Moment!
  }
`;

export const momentResolvers = {
  Query: {
    moments: () => moments,
  },
};
