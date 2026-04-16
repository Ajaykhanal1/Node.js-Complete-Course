const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message = err.message || "Something went wrong on the server";
    
    res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

const notFound = (req, res) => {
    res.status(404).json({
        error: `Route ${req.method} ${req.url} not found`
    });
};

module.exports = { errorHandler, notFound };