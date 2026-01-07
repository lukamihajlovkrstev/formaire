import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { callbackQuerySchema } from '../types/auth.types';

const router = Router();
const authService = new AuthService();

router.get('/login', (req, res, next) => {
  try {
    const authUrl = authService.getAuthorizationUrl();
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

router.get('/callback', async (req, res, next) => {
  try {
    const { code } = callbackQuerySchema.parse(req.query);

    const tokenResponse = await authService.exchangeCodeForToken(code);

    const googleUser = await authService.getUserInfo(
      tokenResponse.access_token,
    );

    // console.log(googleUser);

    // TODO: save to database

    // TODO: create session

    res.redirect(process.env.CLIENT_URL!);
  } catch (error) {
    next(error);
  }
});

router.get('/logout', () => {
  // TODO: implement session delete
});
router.get('/me', () => {
  // TODO: implement user info fetch
});

export default router;
