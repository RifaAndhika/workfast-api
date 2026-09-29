import app from "./app";
import "./workers/update-revenue/update-revenue.worker";
import "./workers/send-receipt/send-receipt.worker";
import "./workers/notify-slack/notify-slack.worker";
import "./cron/monthly-report/monthly-report.scheduler";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
