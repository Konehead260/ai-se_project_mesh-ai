import { Router } from 'express';
import { listUserChats, createChat, fetchChat, deleteChat, sendMessage } from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.get('/', listUserChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', fetchChat);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessage)


export { chatsRouter };