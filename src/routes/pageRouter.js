import express from 'express'
import { WebAuthentication } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/', (req, res) => res.redirect('/dashboard'));

router.use(WebAuthentication);

router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get("/thai-customers/creators", (req, res) => res.render('creatorThaiCustomers'));
router.get("/thai-customers/non-creators", (req, res) => res.render('nonCreatorThaiCustomers'));
router.get("/customer-transactions-details/:id", (req, res) => res.render('customerTransactionsInfo'));
router.get('/pending-customer-withdrawals', (req, res) => res.render('pendingCustomerWithdrawals'));
router.get('/customer-withdrawals', (req, res) => res.render('customerWithdrawals'));
router.get('/agencies', (req, res) => res.render('agencies'));
router.get('/logout', (req, res) => { res.clearCookie("token"); res.redirect('/login') });

export default router;