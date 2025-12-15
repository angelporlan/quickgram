import { AiUsageDaily } from "../models/AiUsageDaily.js";
import { AI_LIMITS } from "../config/aiLimits.js";

export const checkAndConsumeAiUsage = async (user, options = {}) => {
    const today = new Date().toISOString().split("T")[0];
    const limit = AI_LIMITS[user.subscription_role] ?? 0;
    const dryRun = options.dryRun ?? false;

    let usage = await AiUsageDaily.findOne({
        where: {
            user_id: user.id,
            date: today
        }
    });

    if (!usage) {
        usage = await AiUsageDaily.create({
            user_id: user.id,
            date: today,
            used: 0
        });
    }

    if (usage.used >= limit) {
        return {
            allowed: false,
            remaining: 0,
            limit
        };
    }

    if (!dryRun) {
        usage.used += 1;
        await usage.save();
    }

    return {
        allowed: true,
        remaining: limit - usage.used,
        limit
    };
};
