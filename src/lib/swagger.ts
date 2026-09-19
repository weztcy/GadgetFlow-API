import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "GadgetFlow API",

      version: "1.0.0",

      description: "REST API documentation for GadgetFlow application.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication and account access endpoints",
      },

      {
        name: "Admin",
        description: "Admin protected endpoints",
      },

      {
        name: "Profile",
        description: "Authenticated user profile endpoints",
      },

      {
        name: "Products",
        description: "Product management endpoints",
      },

      {
        name: "Categories",
        description: "Product category management endpoints",
      },

      {
        name: "Orders",
        description: "Order management endpoints",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [process.cwd() + "/src/app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
