import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ Status: false, Error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "jwt_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ Status: false, Error: "Invalid token" });
    }
}; 