const sendBadRequestError = (res, msg) => {
    return res.status(400).json({
        errors: [
            {
                msg,
            },
        ],
    });
};

export { sendBadRequestError };
