import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";
import { processInterviewAndSendReport } from "../services/interviewService.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

/**
 * Process Interview Completion via Inngest (Async)
 */
const processInterviewCompletion = inngest.createFunction(
  { id: "process-interview-completion" },
  { event: "interview/completed" },
  async ({ event }) => {
    await connectDB();
    const { interviewId } = event.data;
    console.log(`📧 Inngest processing interview: ${interviewId}`);
    
    const result = await processInterviewAndSendReport(interviewId);
    return result;
  }
);

export const functions = [syncUser, deleteUserFromDB, processInterviewCompletion];
