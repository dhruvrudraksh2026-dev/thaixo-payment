import express from 'express'
import LoginController from '../controllers/loginController.js';
import { ApiAuthentication } from '../middlewares/authenticate.js';
import multer from 'multer';
import Response from '../helpers/response.js';
import customerController from '../controllers/customerController.js';
import customerTransactionsController from '../controllers/customerTransactionsController.js';
import customerWithdrawalsController from '../controllers/customerWithdrawalsController.js';
import agencyController from '../controllers/agencyController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', upload.none(), LoginController.login);

router.use(ApiAuthentication);

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

// =============================================================================================================================
// Customer Legal Details Verification
// =============================================================================================================================
router.patch("/customer/legal-details/approve/:id", customerController.verifyCustomerLegalDetailsById);
router.patch("/customer/legal-details/reject/:id", customerController.unverifyCustomerLegalDetailsById);
// =============================================================================================================================

// =============================================================================================================================
// =============================================================================================================================
// All Customer Withdrawals APIs
// =============================================================================================================================
router.get("/customer-withdrawals", customerWithdrawalsController.getAllCustomerWithdrawals);
router.get("/customer-withdrawals/by-date-range", customerWithdrawalsController.getAllCustomerWithdrawalsByDateRange);
router.get("/customer-withdrawals/total-by-date-range", customerWithdrawalsController.getAllCustomerWithdrawalsTotalAmountByDateRange);
// =============================================================================================================================
// Pending Customer Withdrawals
// =============================================================================================================================
router.get("/customer-withdrawals/pending", customerWithdrawalsController.getAllPendingCustomerWithdrawals);
router.get("/customer-withdrawals/total-pending", customerWithdrawalsController.getCustomerWithdrawalTotalPendingAmount);
// =============================================================================================================================
// Customer Withdrawal CRUD For Customer
// =============================================================================================================================
router.get("/customer-withdrawal/:id", customerWithdrawalsController.getCustomerWithdrawalByWithdrawalId);
router.post("/customer-withdrawal", upload.none(), customerWithdrawalsController.addCustomerWithdrawal);
router.put("/customer-withdrawal", upload.none(), customerWithdrawalsController.editCustomerWithdrawal);
router.delete("/customer-withdrawal/:id", customerWithdrawalsController.deleteCustomerWithdrawal);
// =============================================================================================================================
// Customer Related Withdrawals
// =============================================================================================================================
router.get("/customer-withdrawals/:customerId/withdrawals/paid", customerWithdrawalsController.getTotalPaidCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals/pending", customerWithdrawalsController.getTotalPendingCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals", customerWithdrawalsController.getAllCustomerWithdrawalsByCustomerId); // Withdrawals By Customer Id
router.get("/customer-withdrawals/:customerId/withdrawals/by-date-range", customerWithdrawalsController.getCustomerWithdrawalsByDateRangeByCustomerId); // Withdrawals By Date Range
router.get("/customer-withdrawals/:customerId/withdrawals/total-by-date-range", customerWithdrawalsController.getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId); // Withdrawals Total Amount By Date Range
// =============================================================================================================================
// Update Customer Withdrawal Status
// =============================================================================================================================
router.patch("/customer-withdrawals/update-status", upload.none(), customerWithdrawalsController.updateSelectedCustomerWithdrawalStatus);
// =============================================================================================================================
// =============================================================================================================================

// For Agency
router.get("/agencies", agencyController.getAllAgency);
router.get("/agency/:id", agencyController.getAgencyById);
router.post("/agency", upload.none(), agencyController.addAgency);
router.put("/agency", upload.none(), agencyController.updateAgencyById);
router.delete("/agency/:id", upload.none(), agencyController.deleteAgencyById);

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