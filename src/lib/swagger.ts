import swaggerJsdoc from "swagger-jsdoc";


const options = {

    definition:{

        openapi:"3.0.0",


        info:{

            title:"Belajar API Documentation",

            version:"1.0.0",

            description:
            "API documentation for ERP Learning Project"

        },


        servers:[

            {
                url:"http://localhost:3000"
            }

        ],



        components:{


            securitySchemes:{


                bearerAuth:{


                    type:"http",


                    scheme:"bearer",


                    bearerFormat:"JWT"

                }

            }

        }

    },



    apis:[

        process.cwd() + "/src/app/api/**/*.ts"

    ]

};



export const swaggerSpec =
swaggerJsdoc(options);