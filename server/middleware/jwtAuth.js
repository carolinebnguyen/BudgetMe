import 'dotenv/config';
import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token. Authorization denied' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded.user;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                msg: 'Token is expired.',
            });
        }
        return res.status(401).json({
            msg: 'Token is invalid.',
        });
    }
};

export default jwtAuth;
