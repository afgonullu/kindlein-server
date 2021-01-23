const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const bookDefs = `
  type Book {
    title: String
    author: String
  }
  
  extend type Query {
    books: [Book]
  }
`;

export const bookResolvers = {
  Query: {
    books: () => books,
  },
};
