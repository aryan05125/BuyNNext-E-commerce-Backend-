const express = require('express');
const router = express.Router();
const {protect, admin} = require("../middleware/authMiddleware");
const { route } = require('./authRoutes');

router.get('/profile', protect, admin, (req, res) => {
    res.json({ 
        message: "User profile accessed",
        user: req.user
        });
}
);

router.get('/admin', (req, res) => {
    res.json({ message: "Welcome Admin " });

});


module.exports = router;

