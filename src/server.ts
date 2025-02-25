import express from "express";
import dotenv from "dotenv";
import stationRoutes from "./routes/station.routes";
import sessionRoutes from "./routes/session.routes";
import chargingPointRoutes from "./routes/chargingPoint.routes";
import customerRoutes from "./routes/customer.routes";
import setupSwagger from "./swagger";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
setupSwagger(app);

app.use("/ev/stations", stationRoutes);
app.use("/ev/sessions", sessionRoutes);
app.use("/ev/charging-points", chargingPointRoutes);
app.use("/ev/customers", customerRoutes);

export default app;

 