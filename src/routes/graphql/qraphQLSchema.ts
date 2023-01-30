import DB from '../../utils/DB/DB';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLScalarType,
} from 'graphql';

type ContextType = {
  db: DB;
  loaders: {
    [key: string]: any;
  };
};
function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

const UUIDScalar = new GraphQLScalarType({
  name: 'UUID',
  description: 'A universally unique identifier (UUID) as defined by RFC 4122',
  parseValue(value) {
    if (typeof value === 'string' && isUuid(value)) {
      return value;
    }
    throw new TypeError(`Value is not a valid UUID: ${value}`);
  },
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: UUIDScalar },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: UUIDScalar },
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
    id: { type: UUIDScalar },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: UUIDScalar },
    memberTypeId: { type: GraphQLID },
    memberType: {
      type: MemberType,
      resolve: (parent, args, context: ContextType) => {
        return context.loaders.memberTypeLoader.load(parent.memberTypeId);
      },
    },
  },
});

const UserMutationResponse = new GraphQLObjectType({
  name: 'UserMutationResponse',
  fields: {
    id: { type: UUIDScalar },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(UUIDScalar) },
  },
});

const UserType: any = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDScalar },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent, args, context: ContextType) => {
        return context.loaders.postLoader.load(parent.id);
      },
    },
    profile: {
      type: ProfileType,
      resolve: (parent, args, context: ContextType) => {
        return context.loaders.profileLoader.load(parent.id, 'profile');
      },
    },
    subscribedToUserIds: { type: new GraphQLList(UUIDScalar) },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: ContextType) => {
        const userSubscribedToIds = parent.subscribedToUserIds;
        return await context.loaders.userLoader.loadMany(userSubscribedToIds);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: ContextType) => {
        return await context.loaders.userSubscribedToLoader.load(parent.id);
      },
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: UUIDScalar },
      },
      resolve: async (parent, args, context: ContextType) => {
        const user = await context.loaders.userLoader.load(args.id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, context: ContextType) => {
        const users = await context.db.users.findMany();
        return users;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDScalar },
      },
      resolve: async (parent, args, context: ContextType) => {
        const profile = await context.db.profiles.findOne({
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
      resolve: async (parent, args, context: ContextType) => {
        const profiles = await context.db.profiles.findMany();
        return profiles;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDScalar },
      },
      resolve: async (parent, args, context: ContextType) => {
        const post = await context.db.posts.findOne({
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
      resolve: async (parent, args, context: ContextType) => {
        const posts = await context.db.posts.findMany();
        return posts;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args, context: ContextType) => {
        const memberType = await context.db.memberTypes.findOne({
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
      resolve: async (parent, args, context: ContextType) => {
        const memberTypes = await context.db.memberTypes.findMany();
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
    userId: { type: new GraphQLNonNull(UUIDScalar) },
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
    userId: { type: UUIDScalar },
    memberTypeId: { type: GraphQLID },
  },
  description: 'Profile input type',
});

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(UUIDScalar) },
  },
  description: 'Post input type',
});

const UpdatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: UUIDScalar },
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
    userId: { type: new GraphQLNonNull(UUIDScalar) },
  },
  description: 'SubccribeTo input type',
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserMutationResponse,
      args: {
        input: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (parent, { input }, context: ContextType) => {
        return await context.db.users.create(input);
      },
    },
    updateUser: {
      type: UserMutationResponse,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        input: { type: new GraphQLNonNull(UpdateUserInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: id,
        });
        if (!user) {
          throw new Error('User not found');
        }
        return await context.db.users.change(id, input);
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        input: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (parent, { input }, context: ContextType) => {
        const profile = await context.db.profiles.findOne({
          key: 'userId',
          equals: input.userId,
        });
        if (profile) {
          throw new Error('Profile already exists');
        }
        return await context.db.profiles.create(input);
      },
    },
    updateProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        input: { type: new GraphQLNonNull(UpdateProfileInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: id,
        });
        if (!profile) {
          throw new Error('Profile not found');
        }
        return await context.db.profiles.change(id, input);
      },
    },
    createPost: {
      type: PostType,
      args: {
        input: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (parent, { input }, context: ContextType) => {
        return await context.db.posts.create(input);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        input: { type: new GraphQLNonNull(UpdatePostInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: id,
        });
        if (!post) {
          throw new Error('Post not found');
        }
        return await context.db.posts.change(id, input);
      },
    },
    updateMemberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateMemberTypeInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const memberType = await context.db.memberTypes.findOne({
          key: 'id',
          equals: id,
        });
        if (!memberType) {
          throw new Error('MemberType not found');
        }
        return await context.db.memberTypes.change(id, input);
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        input: { type: new GraphQLNonNull(SubccribeInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: input.userId,
        });
        if (!user) {
          throw new Error('User not found');
        }
        const userSubscribedToUserIds = user.subscribedToUserIds;

        if (!userSubscribedToUserIds.includes(id)) {
          userSubscribedToUserIds.push(id);
        } else {
          throw new Error('User already subscribed');
        }

        const returned = await context.db.users.change(input.userId, {
          subscribedToUserIds: userSubscribedToUserIds,
        });
        return returned;
      },
    },
    unsubscribeTo: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        input: { type: new GraphQLNonNull(SubccribeInputType) },
      },
      resolve: async (parent, { id, input }, context: ContextType) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: input.userId,
        });
        if (!user) {
          throw new Error('User not found');
        }
        const userSubscribedToUserIds = user.subscribedToUserIds;

        if (userSubscribedToUserIds.includes(id)) {
          userSubscribedToUserIds.splice(
            userSubscribedToUserIds.indexOf(id),
            1
          );
        } else {
          throw new Error('User not subscribed');
        }

        const returned = await context.db.users.change(input.userId, {
          subscribedToUserIds: userSubscribedToUserIds,
        });
        return returned;
      },
    },
  },
});

const schema: GraphQLSchema = new GraphQLSchema({
  query,
  mutation,
  types: [UserType, ProfileType, PostType, MemberType],
});

export default schema;
