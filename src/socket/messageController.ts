import { Request, Response } from 'express';
import Message from '../models/Message';

// Get messages between logged-in user and another user
export const getMessages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params; // receiver id
    const senderId = (req.user as any)._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: id },
        { sender: id, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Send a message (with optional image upload)
export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { room, sender, receiver, text, url } = req.body as {
      room: string;
      sender: string;
      receiver: string;
      text: string;
      url?: string;
    };

    // Basic validation
    if (!room || !sender || !receiver || (!text && !url)) {
      res
        .status(400)
        .json({
          message: 'room, sender, receiver, and text or url are required',
        });
      return;
    }

    const newMessage = await Message.create({
      room,
      sender,
      receiver,
      text,
      url: url || '',
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
