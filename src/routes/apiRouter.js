import express from 'express'
import LoginController from '../controllers/loginController.js';
import { ApiAuthentication } from '../middlewares/authenticate.js';
import multer from 'multer';
import Response from '../helpers/response.js';
import customerController from '../controllers/customerController.js';
import customerTransactionsController from '../controllers/customerTransactionsController.js';
import customerWithdrawalsController from '../controllers/customerWithdrawalsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', upload.none(), LoginController.login);

router.use(ApiAuthentication);

router.get("check", (req, res) => res.json(Response.success("API Is Working Fine")));

router.get("/customer-transactions/:id", customerTransactionsController.getAllCustomerTransactionsById);
router.get("/customer-transactions/total/:id", customerTransactionsController.getCustomerTransactionsTotalAmountById);
router.post("/customer-transaction", upload.none(), customerTransactionsController.addCustomerTransaction);
router.put("/customer-transaction", upload.none(), customerTransactionsController.editCustomerTransaction);

router.get("/customer-transaction/:id/earnings/total", customerTransactionsController.getCustomerEarningsTotalAmountById);
router.get("/customer-transaction/:id/earnings/paid", customerTransactionsController.getCustomerEarningsPaidAmountById);
router.get("/customer-transaction/:id/earnings", customerTransactionsController.getCustomerEarningsTotalAmountByDateRange); // Date Range Earnings

router.get("/customers/thai", customerController.getThaiCustomers);
router.post("/customer/:id/generate-otp", customerController.updateGeneratedOtpById);
router.patch("/customer/:id/toggle-white-listed", customerController.toggleWhiteListedById);
router.get("/customer/:id", customerController.getCustomerById);

router.get("/customer-withdrawals", customerWithdrawalsController.getAllCustomerWithdrawals);
router.get("/customer-withdrawal/:id", customerWithdrawalsController.getCustomerWithdrawalByWithdrawalId);
router.post("/customer-withdrawal", upload.none(), customerWithdrawalsController.addCustomerWithdrawal);
router.put("/customer-withdrawal", upload.none(), customerWithdrawalsController.editCustomerWithdrawal);
router.delete("/customer-withdrawal/:id", customerWithdrawalsController.deleteCustomerWithdrawal);

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