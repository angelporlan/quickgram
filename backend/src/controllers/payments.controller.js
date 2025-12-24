import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.ENV === "PROD" ? process.env.STRIPE_SECRET_KEY_PROD : process.env.STRIPE_SECRET_KEY_TEST);

const getFrontUrl = () => {
    const rawUrl = process.env.ENV === "TEST" ? process.env.URL_FRONT_TEST : process.env.URL_PROD;
    if (!rawUrl) return "http://localhost:4200";
    return rawUrl.startsWith("http") ? rawUrl : `http://${rawUrl}`;
};

const FRONT_URL = getFrontUrl();
console.log("Stripe Redirect URL Base:", FRONT_URL);

export const createSessionPremium = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Premium Subscription",
                        description: "40 consultas IA diarias\nTodo lo de Pro\nContenido exclusivo\nAnálisis personalizado\nSesiones 1-on-1\nCertificados oficiales",
                    },
                    unit_amount: 1999,
                    recurring: {
                        interval: "month",
                    },
                },
                quantity: 1,

            },
        ],
        mode: "subscription",
        success_url: `${FRONT_URL}/success`,
        cancel_url: `${FRONT_URL}/cancel`,
    });
    return res.json(session);
}

export const createSessionPro = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Pro Subscription",
                        description: "15 consultas IA diarias\nAcceso a todos los ejercicios\nEstadísticas avanzadas\nSimulacros de examen",
                    },
                    unit_amount: 999,
                    recurring: {
                        interval: "month",
                    },
                },
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${FRONT_URL}/success`,
        cancel_url: `${FRONT_URL}/cancel`,
    });
    return res.json(session);
}
