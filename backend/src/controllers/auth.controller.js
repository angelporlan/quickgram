import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
};

export const register = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        username,
        email,
        password_hash: hashedPassword
    });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
};