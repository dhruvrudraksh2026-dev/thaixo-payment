import express from 'express'
import { WebAuthentication } from '../middlewares/authenticate.js';
// import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/', (req, res) => res.redirect('/dashboard'));

router.use(WebAuthentication);

router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/thai-customers', (req, res) => res.render('customersThai'));
router.get("/customer-transactions-details/:id", (req, res) => res.render('customerTransactionsInfo'));
router.get('/customer-withdrawals', (req, res) => res.render('customerWithdrawals'));
router.get('/logout', (req, res) => { res.clearCookie("token"); res.redirect('/login') });

export default router;