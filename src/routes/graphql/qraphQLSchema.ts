import DB from './../../utils/DB/DB';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLNonNull,
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

/* {
  "subscribeTo": {
    "id": "40b2df67-8e3a-4963-a279-364b48f0e13a"
  } */

/* const subscribeReturnType = new GraphQLObjectType({
  name: 'SubscribeReturnType',
  fields: {
    subscribeTo: {
      type: ProfileType,
    },
  },
}); */

/* const UserSubscribedTo = new GraphQLObjectType({
  name: 'UserSubscribedTo',
  fields: {
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: (parent, args, db: DB) => {
        const userSubscribedTo = parent.subscribedToUserIds;
        const promiseProfiles = userSubscribedTo.map((id: string) => {
          return db.profiles.findOne({
            key: 'userId',
            equals: id,
          });
        });
        return Promise.all(promiseProfiles);
      },
    },
  },
}); */

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
    userSubscribedTo: {
      type: new GraphQLList(ProfileType),
      resolve: (parent, args, db: DB) => {
        const userSubscribedTo = parent.subscribedToUserIds;
        const promiseProfiles = userSubscribedTo.map((id: string) => {
          return db.profiles.findOne({
            key: 'userId',
            equals: id,
          });
        });
        return Promise.all(promiseProfiles);
      },
    },
    /* subscribedToUser: {
      type: new GraphQLList(PostType),
      resolve: (parent, args, db: DB) => {
        const userSubscribedToMe = db.users.findMany();
      }
    } */
  },
});

const query = new GraphQLObjectType({
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

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  description: 'User input type',
});

const UpdateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  description: 'User input type',
});

export const createProfileBodySchema = {
  type: 'object',
  required: [
    'avatar',
    'sex',
    'birthday',
    'country',
    'street',
    'city',
    'userId',
    'memberTypeId',
  ],
  properties: {
    avatar: { type: 'string' },
    sex: { type: 'string' },
    birthday: { type: 'number' },
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    userId: { type: 'string', format: 'uuid' },
    memberTypeId: {
      type: 'string',
    },
  },
  additionalProperties: false,
} as const;

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: 'Profile input type',
});

const UpdateProfileInputType = new GraphQLInputObjectType({
  name: 'UpdateProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLID },
  },
  description: 'Profile input type',
});

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: 'Post input type',
});

const UpdatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
  description: 'Post input type',
});

const UpdateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
  description: 'MemberType input type',
});

const SubccribeInputType = new GraphQLInputObjectType({
  name: 'SubccribeToInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: 'SubccribeTo input type',
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (parent, { input }, db: DB) => {
        return await db.users.create(input);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateUserInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const user = await db.users.findOne({
          key: 'id',
          equals: id,
        });
        if (!user) {
          throw new Error('User not found');
        }
        return await db.users.change(id, input);
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        input: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (parent, { input }, db: DB) => {
        return await db.profiles.create(input);
      },
    },
    updateProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateProfileInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const profile = await db.profiles.findOne({
          key: 'id',
          equals: id,
        });
        if (!profile) {
          throw new Error('Profile not found');
        }
        return await db.profiles.change(id, input);
      },
    },
    createPost: {
      type: PostType,
      args: {
        input: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (parent, { input }, db: DB) => {
        return await db.posts.create(input);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdatePostInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const post = await db.posts.findOne({
          key: 'id',
          equals: id,
        });
        if (!post) {
          throw new Error('Post not found');
        }
        return await db.posts.change(id, input);
      },
    },
    updateMemberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateMemberTypeInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const memberType = await db.memberTypes.findOne({
          key: 'id',
          equals: id,
        });
        if (!memberType) {
          throw new Error('MemberType not found');
        }
        return await db.memberTypes.change(id, input);
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(SubccribeInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const user = await db.users.findOne({
          key: 'id',
          equals: id,
        });
        if (!user) {
          throw new Error('User not found');
        }
        const userSubscribedToUserIds = user.subscribedToUserIds;

        if (!userSubscribedToUserIds.includes(input.userId)) {
          userSubscribedToUserIds.push(input.userId);
        } else {
          throw new Error('User already subscribed');
        }

        const returned = await db.users.change(id, {
          subscribedToUserIds: userSubscribedToUserIds,
        });
        return returned;
      },
    },
    unsubscribeTo: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(SubccribeInputType) },
      },
      resolve: async (parent, { id, input }, db: DB) => {
        const user = await db.users.findOne({
          key: 'id',
          equals: id,
        });
        if (!user) {
          throw new Error('User not found');
        }
        const userSubscribedToUserIds = user.subscribedToUserIds;

        if (userSubscribedToUserIds.includes(input.userId)) {
          userSubscribedToUserIds.splice(
            userSubscribedToUserIds.indexOf(input.userId),
            1
          );
        } else {
          throw new Error('User not subscribed');
        }

        const returned = await db.users.change(id, {
          subscribedToUserIds: userSubscribedToUserIds,
        });
        return returned;
      }
    },
  },
});

const schema: GraphQLSchema = new GraphQLSchema({
  query,
  mutation,
  types: [UserType],
});

export default schema;
