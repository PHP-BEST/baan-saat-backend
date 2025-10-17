import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';

export const getUserSession = async (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user as any);
  } else {
    res.send();
  }
};

//desc Get all users
//route GET /api/users
//access Public
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch users', error });
  }
};

//desc Get all providers
//route GET /api/users/providers
//access Public
export const getProviders = async (req: Request, res: Response) => {
  try {
    const providers = await User.find({ role: 'provider' });
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch providers', error });
  }
};

//desc Get a user by ID
//route GET /api/users/:id
//access Public
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch user', error });
  }
};

//desc Create a new user
//route POST /api/users
//access Public
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to create user', error });
  }
};

//desc Search providers
//route GET /api/users/search?query=your_query
//access Public
export const searchProviders = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter is required' });
  }

  if (typeof query !== 'string') {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter must be a string' });
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Query parameter cannot be empty' });
  }

  try {
    const providers = await User.find({ role: 'provider' }).find({
      $or: [
        { name: { $regex: trimmedQuery, $options: 'i' } },
        { email: { $regex: trimmedQuery, $options: 'i' } },
        { telNumber: { $regex: trimmedQuery, $options: 'i' } },
        {
          'providerProfile.description': {
            $regex: trimmedQuery,
            $options: 'i',
          },
        },
      ],
    });
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to search providers', error });
  }
};

//desc Update a user by ID
//route PUT /api/users/:id
//access Public
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    await user.validate();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Failed to update user', error });
  }
};

//desc Delete a user by ID
//route DELETE /api/users/:id
//access Public
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    await Post.deleteMany({ customerId: id });
    res.status(200).json({
      success: true,
      message: 'User and his/her posts deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete user', error });
  }
};

// export const deleteAllUsers = async (req: Request, res: Response) => {
//   try {
//     await User.deleteMany({});
//     res.status(200).json({ success: true, message: 'All users deleted' });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'Failed to delete users', error });
//   }
// };
