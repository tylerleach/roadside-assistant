const expressJWT = require('express-jwt');
const { secret } = require('config.json');

module.exports = authorize;

function authorize(roles = []) {
    // Roles param can be a single role string (e.g. Role.User or 'User')
    // OR an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Authenticate JWT token and attach user to request object (req.user)
        expressJWT({ secret }),

        // Authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // Users role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Authentication and authorization successful
            next();
        }
    ]
}