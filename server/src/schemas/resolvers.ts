import User, { UserDocument } from "../models/User.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

// interface BookData {
//     bookId: string;
//     authors: string[];
//     description: string;
//     title: string;
//     image: string;
//     link: string;
// }

interface saveBookArgs {
  input: {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  };
}

interface Context {
  user?: UserDocument;
}

interface LoginArgs {
  input: {
    email: string;
    password: string;
  };
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

const resolvers = {
  Query: {
    me: async (
      _parent: any,
      _args: any,
      context: Context
    ): Promise<UserDocument | null> => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }

      try {
        return await User.findOne({ _id: context.user._id });
      } catch (err) {
        console.error(err);
        throw new AuthenticationError("Something went wrong!");
      }
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      { input }: LoginArgs
    ): Promise<{ token: string; user: UserDocument }> => {
      try {
        const user = await User.findOne({ email: input.email });

        if (!user) {
          throw new AuthenticationError("Could not find user with that email!");
        }

        const correctPw = await user.isCorrectPassword(input.password);

        if (!correctPw) {
          throw new AuthenticationError("Incorrect password!");
        }

        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new AuthenticationError("Something went wrong!");
      }
    },
    addUser: async (
      _parent: any,
      { input }: AddUserArgs
    ): Promise<{ token: string; user: UserDocument }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (
      _parent: any,
      { input }: saveBookArgs,
      context: Context
    ): Promise<UserDocument | null> => {
      if (context.user) {
        const user = User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: input },
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
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
      }

      throw new AuthenticationError("Not logged in");
    },
  },
};

export default resolvers;
