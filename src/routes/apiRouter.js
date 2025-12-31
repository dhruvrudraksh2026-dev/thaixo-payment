import express from 'express'
import LoginController from '../controllers/loginController.js';
import { ApiAuthentication } from '../middlewares/authenticate.js';
import multer from 'multer';
import Response from '../helpers/response.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', upload.none(), LoginController.login);

router.use(ApiAuthentication);

router.get("check", (req, res) => res.json(Response.success("API Is Working Fine")));

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