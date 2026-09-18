import nodemailer from "nodemailer";



export const transporter =
    nodemailer.createTransport({

        host:
        process.env.EMAIL_HOST,


        port:
        Number(
            process.env.EMAIL_PORT
        ),


        secure:
        process.env.EMAIL_SECURE === "true",


        auth:{

            user:
            process.env.EMAIL_USER,


            pass:
            process.env.EMAIL_PASSWORD

        }

    });






export async function sendEmail(
    options:{
        to:string;

        subject:string;

        html:string;

    }
){


    return await transporter.sendMail({

        from:
        process.env.EMAIL_FROM,


        to:
        options.to,


        subject:
        options.subject,


        html:
        options.html

    });


}