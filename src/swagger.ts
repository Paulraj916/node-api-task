import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { Application } from "express-serve-static-core";

dotenv.config();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "EV Charging Station API",
            version: "1.0.0",
            description: "API documentation for EV charging stations and charging sessions",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Make sure the path to your routes is correct
};


const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
