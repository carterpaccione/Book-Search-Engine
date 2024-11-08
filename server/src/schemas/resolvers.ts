import User, { UserDocument } from '../models/User.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface BookData {
    authors: string[];
    description: string;
    title: string;
    bookId: string;
    image: string;
    link: string;
}

interface saveBookArgs {
    userId: string;
    bookData: BookData;
}

interface Context {
    user?: UserDocument;
}

const resolvers = {
  Query: {
    me: async (
      _parent: any,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (
      _parent: any,
      args: { username: string; email: string; password: string }
    ): Promise<{token: string, user: UserDocument}> => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, args: saveBookArgs, context: Context): Promise<UserDocument | null> => {
      if (context.user) {
        const user = User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: args.bookData },
          },
          { new: true, runValidators: true }
        );
        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { _id: bookId } } },
          { new: true }
        );
      }

      throw new AuthenticationError("Not logged in");
    },
  },
};

export default resolvers;