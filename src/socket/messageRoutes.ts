import express from "express";
import { getMessages, sendMessage } from "../socket/messageController";

const messageRoutes = express.Router();

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get messages between two users
 *     parameters:
 *       - in: query
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sender
 *       - in: query
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the receiver
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sender:
 *                     type: string
 *                   receiver:
 *                     type: string
 *                   text:
 *                     type: string
 *                   url:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: senderId or receiverId missing
 *       500:
 *         description: Internal server error
 */
messageRoutes.get("/:id", getMessages);

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receiver
 *               - text
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               text:
 *                 type: string
 *               url:
 *                 type: string
 *                 description: Optional URL for file/image/video
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sender:
 *                   type: string
 *                 receiver:
 *                   type: string
 *                 text:
 *                   type: string
 *                 url:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
messageRoutes.post("/send/:id", sendMessage);

export default messageRoutes;
