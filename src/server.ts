import app from "./app";
import "./workers/update-revenue/update-revenue.worker";
import "./workers/send-receipt/send-receipt.worker";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
