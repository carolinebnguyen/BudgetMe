import 'dotenv/config';
import jwt from 'jsonwebtoken';

function jwtAuth(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token. Authorization denied' });
    }

    try {
        const jwtToken = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtToken);

        req.user = decoded.user;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                msg: 'Token is expired.',
                status: 'EXPIRED',
            });
        }
        return res.status(401).json({
            msg: 'Token is invalid.',
            status: 'INVALID',
        });
    }
}

export default jwtAuth;
