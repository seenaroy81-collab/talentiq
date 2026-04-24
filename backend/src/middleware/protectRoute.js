import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  async (req, res, next) => {
    try {
      // Safely get auth - req.auth is a function from clerkMiddleware
      const auth = req.auth?.();
      const clerkId = auth?.userId;

      if (!clerkId) {
        console.log("❌ protectRoute: No clerkId found in request");
        return res.status(401).json({ message: "Unauthorized - please log in" });
      }

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // if user doesn't exist, create them from Clerk data
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        // Create user from Clerk session data
        user = await User.create({
          clerkId,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkId}@clerk.user`,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
          profileImage: clerkUser.imageUrl || "",
        });

        console.log("✅ Auto-created user from Clerk:", user.email);
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error.message);
      res.status(401).json({ message: "Authentication error" });
    }
  },
];
