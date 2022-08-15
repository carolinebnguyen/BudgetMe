import jwt from 'jsonwebtoken';

const jwtSign = (userId) => {
    const payload = {
        user: {
            id: userId,
        },
    };

    const jwtToken = process.env.JWT_SECRET;

    // Expires in 3 hrs * 60 mins * 60 seconds per min = 10800 seconds
    const secondsToExpire = 3 * 60 * 60;
    return jwt.sign(payload, jwtToken, { expiresIn: secondsToExpire });
};

export default jwtSign;
