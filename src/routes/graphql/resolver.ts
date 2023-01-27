//@ts-nocheck
import Post from '../models/post';
const resolvers = {
    Query: {
        posts: async (_, obj) => {
            const posts = await Post.find({});
            return posts;
        },
        post: async (_, obj) => {
            const { id } = obj;
            const post = await Post.findById(id);
            return post;
        }
    },
    Mutation: {
        createPost: async (_, { data }) => {
            const newPost = new Post(data);
            const post = await newPost.save();
            return post;
        }
    }
};
export default resolvers;