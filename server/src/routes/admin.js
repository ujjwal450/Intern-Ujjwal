const express = require("express");
const Admin = require("../models/admin");
const User = require("../models/user");
const auth = require("../middleware/adminAuth");

const router = new express.Router();

router.post("/admin", async (req, res) => {
    const admin = new Admin(req.body);
    try {
        await admin.save();
        const token = await admin.generateAuthToken();
        res.status(201).send({
            admin,
            token
        });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

router.post("/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await admin.generateAuthToken();
        res.status(200).send({
            admin,
            token
        });
    } catch (error) {
        res.send({
            error: error.message
        });
    }
});

router.patch("/admin/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "firstName",
        "lastName",
        "email",
        "password",
        "mobileNo",
        "username",
    ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid Updates"
        });
    }
    try {
        const admin = await Admin.findById(req.admin.id);

        updates.forEach((update) => (admin[update] = req.body[update]));
        await admin.save();
        if (!admin) {
            return res.status(400).send();
        }
        res.send(admin);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

router.post("/admin/logout", auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.admin.save();
        res.send();
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

router.post("/admin/logoutAll", auth, async (req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save();
        res.send();
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

router.post("/admin/createUser", auth, async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.password)
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

router.get("/admin/listUsers", auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

router.patch("/admin/updateUser/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "firstName",
        "lastName",
        "email",
        "password",
        "mobileNo",
        "username",
    ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid Updates"
        });
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        if (!user) {
            return res.status(400).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

module.exports = router;