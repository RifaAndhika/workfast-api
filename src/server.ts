import app from "./app";
import "./workers/update-revenue/update-revenue.worker";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
