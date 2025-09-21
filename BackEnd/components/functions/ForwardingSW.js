import cron from "node-cron";
import Issue from "../Models/IssueModel.js";
import { sendMessage } from "./helper.js";

export function startEscalationJob() {
  cron.schedule("* * * * *", async () => {
    const tenMinutesAgo = new Date(Date.now() - 1* 30 * 1000); // format is minuts* sec * ms

    try {
      const issuesToForward = await Issue.find({
        status: "reported",
        reportedAt: { $lte: tenMinutesAgo }
      }).populate("subscribers", "email _id");

      if (issuesToForward.length > 0) {
        console.log(` Escalating ${issuesToForward.length} issues...`);

        for (const issue of issuesToForward) {
          issue.status = "forwarded";
          await issue.save();

          for (const sub of issue.subscribers) {
            try {
              await sendMessage(sub, `Issue "${issue.description}" has been forwarded ✅`);
            } catch (notifyErr) {
              console.error(` Failed to notify subscriber ${sub._id}:`, notifyErr);
            }
          }
        }
      }
    } catch (err) {
      console.error(" Cron escalation error:", err);
    }
  });
}
