import express from 'express'
import LoginController from '../controllers/loginController.js';
import { ApiAuthentication } from '../middlewares/authenticate.js';
import multer from 'multer';
import Response from '../helpers/response.js';
import customerController from '../controllers/customerController.js';
import customerTransactionsController from '../controllers/customerTransactionsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', upload.none(), LoginController.login);

router.use(ApiAuthentication);

router.get("check", (req, res) => res.json(Response.success("API Is Working Fine")));

router.get("/customer-transactions/:id", customerTransactionsController.getCustomerTransactionsById);
router.get("/customer-transactions/total/:id", customerTransactionsController.getCustomerTransactionsTotalMinutesById);

router.get("/customers/thai", customerController.getThaiCustomers);
router.get("/customer/:id", customerController.getCustomerById);

router.use((req, res, next) =>
{
    return res.json(Response.failure('API not found'));
});
router.use((err, req, res, next) =>
{
    console.error(err);
    return res.json(Response.failure('Some Internal server error occured'));
});
export default router;