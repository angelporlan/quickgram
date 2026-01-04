import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sequelize } from "../config/db.js";


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

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Missing Google credential" });
        }

        const { OAuth2Client } = await import('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return res.status(400).json({ message: "Email not provided by Google" });
        }

        let user = await User.findOne({
            where: {
                [sequelize.Sequelize.Op.or]: [
                    { email },
                    { google_id: googleId }
                ]
            }
        });

        if (!user) {
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            user = await User.create({
                name: name || email.split('@')[0],
                username,
                email,
                password_hash: await bcrypt.hash(Math.random().toString(36), 10),
                google_id: googleId,
                avatar_seed: email,
                coins: 10
            });
        } else if (!user.google_id) {
            user.google_id = googleId;
            await user.save();
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ message: "Invalid Google token" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const crypto = await import('crypto');
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000;

        user.reset_password_token = token;
        user.reset_password_expires = expires;
        await user.save();

        const rawUrl = process.env.ENV === "TEST" ? process.env.URL_FRONT_TEST : process.env.URL_PROD;

        const resetUrl = `${rawUrl}/reset-password/${token}`;

        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Restablecer contraseña - QuickGram',
                html: `
                    <h1>Restablecer Contraseña</h1>
                    <p>Has solicitado restablecer tu contraseña.</p>
                    <p>Haz clic en el siguiente enlace para continuar:</p>
                    <a href="${resetUrl}">Restablecer contraseña</a>
                    <p>Este enlace expirará en 1 hora.</p>
                `
            });
            console.log(`Reset email sent to ${email}`);
        } catch (emailError) {
            console.error('Resend error:', emailError);
            console.log(`Backup Link: ${resetUrl}`);
            return res.status(500).json({ message: "Error sending email, check console for backup link" });
        }

        res.json({ message: "Enlace de recuperación enviado a tu correo" });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const { Op } = await import("sequelize");
        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        user.password_hash = await bcrypt.hash(password, 10);
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        res.json({ message: "Password has been reset" });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
