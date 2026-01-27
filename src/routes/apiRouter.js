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

router.get("/customer-transactions/:id", customerTransactionsController.getAllCustomerTransactionsById);
router.get("/customer-transactions/total/:id", customerTransactionsController.getCustomerTransactionsTotalAmountById);
router.post("/customer-transaction", upload.none(), customerTransactionsController.addCustomerTransaction);
router.put("/customer-transaction", upload.none(), customerTransactionsController.editCustomerTransaction);
router.get("/customer-transaction", upload.none(), customerTransactionsController.getCustomerTransactionByCustomerIdAndTimestamp); // Get customer transaction using customer id and timestamp

router.get("/customers/thai", customerController.getThaiCustomers);
router.post("/customer/:id/generate-otp", customerController.updateGeneratedOtpById);
router.patch("/customer/:id/toggle-white-listed", customerController.toggleWhiteListedById);
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