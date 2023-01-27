import DB from './../../utils/DB/DB';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
} from 'graphql';

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLID },
    memberType: {
      type: MemberType,
      resolve: (parent, args, db: DB) => {
        return db.memberTypes.findOne({
          key: 'id',
          equals: parent.memberTypeId,
        });
      },
    },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent, args, db: DB) => {
        return db.posts.findMany({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
    profile: {
      type: ProfileType,
      resolve: (parent, args, db: DB) => {
        return db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });
      },
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args, db: DB) => {
        const user = await db.users.findOne({
          key: 'id',
          equals: args.id,
        });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, db: DB) => {
        const users = await db.users.findMany();
        return users;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args, db: DB) => {
        const profile = await db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });
        if (!profile) {
          throw new Error('Profile not found');
        }
        return profile;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (parent, args, db: DB) => {
        const profiles = await db.profiles.findMany();
        return profiles;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args, db: DB) => {
        const post = await db.posts.findOne({
          key: 'id',
          equals: args.id,
        });
        if (!post) {
          throw new Error('Post not found');
        }
        return post;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, args, db: DB) => {
        const posts = await db.posts.findMany();
        return posts;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args, db: DB) => {
        const memberType = await db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });
        if (!memberType) {
          throw new Error('MemberType not found');
        }
        return memberType;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args, db: DB) => {
        const memberTypes = await db.memberTypes.findMany();
        return memberTypes;
      },
    },
  },
});
/* const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (parent, args, db) => {
        const user = await db.users.create(args);
        return user;
      },
    },
  },
}); */

const schema: GraphQLSchema = new GraphQLSchema({
  query: QueryType,
  // mutation: MutationType,
  types: [UserType],
});

export default schema;
