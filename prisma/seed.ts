import {
    prisma
} from "../src/lib/prisma";


import bcrypt from "bcrypt";




async function main(){



    // ============================
    // CREATE USER
    // ============================


    const adminPassword =
        await bcrypt.hash(
            "password123",
            10
        );


    const userPassword =
        await bcrypt.hash(
            "password123",
            10
        );




    await prisma.user.create({

        data:{

            name:"Budi Admin",

            email:"budi@gmail.com",

            password:adminPassword,

            role:"ADMIN"

        }

    });





    await prisma.user.create({

        data:{

            name:"Andi User",

            email:"andi@gmail.com",

            password:userPassword,

            role:"USER"

        }

    });






    // ============================
    // CREATE CATEGORY
    // ============================


    const elektronik =
        await prisma.category.create({

            data:{

                name:"Elektronik"

            }

        });







    // ============================
    // CREATE PRODUCT
    // ============================


    await prisma.product.createMany({

        data:[


            {

                name:"Laptop",

                price:15000000,

                categoryId:
                elektronik.id

            },



            {

                name:"Mouse",

                price:300000,

                categoryId:
                elektronik.id

            },



            {

                name:"Keyboard",

                price:800000,

                categoryId:
                elektronik.id

            }


        ]

    });







    console.log(
        "Seed berhasil"
    );

}





main()

.catch((error)=>{


    console.error(error);


})

.finally(async()=>{


    await prisma.$disconnect();


});