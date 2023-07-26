import express from 'express';
import userController from '../controllers/user-controller.js';
import contactController from '../controllers/contact-controller.js';
import addressController from '../controllers/address-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get('/api/users/current', userController.getUser);
userRouter.patch('/api/users', userController.updateUser);
userRouter.get('/api/users/logout', userController.logout);

userRouter.post('/api/contact', contactController.createContact);
userRouter.get('/api/contacts/:contactId', contactController.getContact);
userRouter.get('/api/contacts', contactController.searchContact);
userRouter.put('/api/contact/:contactId', contactController.updateContact);
userRouter.delete('/api/contact/:contactId', contactController.removeContact);

userRouter.post('/api/contact/:contactId/address', addressController.createAddress);
userRouter.get('/api/contact/:contactId/address/:addressId', addressController.getAddress);
userRouter.put('/api/contact/:contactId/address/:addressId', addressController.updateAddress);
userRouter.delete('/api/contact/:contactId/address/:addressId', addressController.removeAddress);
userRouter.get('/api/contact/:contactId/address', addressController.listAddress);

export { userRouter };
