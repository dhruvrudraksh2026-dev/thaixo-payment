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

router.get("/customer-transaction/:id/earnings/total", customerTransactionsController.getCustomerEarningsTotalAmountById);
router.get("/customer-transaction/:id/earnings/total-by-date-range", customerTransactionsController.getCustomerEarningsTotalAmountByDateRange); // Total Earnings By Date Range
router.get("/customer-transactions/:id/earnings", customerTransactionsController.getAllCustomerTransactionsByIdAndDateRange); // Date Range Earnings

router.get("/customers/thai", customerController.getThaiCustomers);
router.get("/customers/thai/creator", customerController.getCreatorThaiCustomers);
router.get("/customers/thai/non-creator", customerController.getNonCreatorThaiCustomers);
router.post("/customer/:id/generate-otp", customerController.updateGeneratedOtpById);
router.patch("/customer/:id/toggle-creator", customerController.toggleCreatorById);
router.get("/customer/:id", customerController.getCustomerById);

router.get("/customer-withdrawals", customerWithdrawalsController.getAllCustomerWithdrawals);
router.get("/customer-withdrawals/pending", customerWithdrawalsController.getAllPendingCustomerWithdrawals);
router.get("/customer-withdrawals/total-pending", customerWithdrawalsController.getCustomerWithdrawalTotalPendingAmount);
router.get("/customer-withdrawal/:id", customerWithdrawalsController.getCustomerWithdrawalByWithdrawalId);
router.post("/customer-withdrawal", upload.none(), customerWithdrawalsController.addCustomerWithdrawal);
router.put("/customer-withdrawal", upload.none(), customerWithdrawalsController.editCustomerWithdrawal);
router.delete("/customer-withdrawal/:id", customerWithdrawalsController.deleteCustomerWithdrawal);

router.get("/customer-withdrawals/:customerId/withdrawals/paid", customerWithdrawalsController.getTotalPaidCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals/pending", customerWithdrawalsController.getTotalPendingCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals", customerWithdrawalsController.getAllCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals/by-date-range", customerWithdrawalsController.getCustomerWithdrawalsByDateRangeByCustomerId); // Withdrawals By Date Range
router.get("/customer-withdrawals/:customerId/withdrawals/total-by-date-range", customerWithdrawalsController.getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId); // Withdrawals Total Amount By Date Range

router.patch("/customer-withdrawals/update-status", upload.none(), customerWithdrawalsController.updateSelectedCustomerWithdrawalStatus);

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