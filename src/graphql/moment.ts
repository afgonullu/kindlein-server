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

export const momentDefs = `
  type Moment {
    id: String!,
    date: String!,
    title: String!,
    description: String!,
    location: String!,
    tags: [String],
  }
  
  extend type Query {
    moments: [Moment]
  }
`;

export const momentResolvers = {
  Query: {
    moments: () => moments,
  },
};
