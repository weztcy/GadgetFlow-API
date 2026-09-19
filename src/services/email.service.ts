import {
    sendEmail
} from "@/lib/mail";





export async function sendWelcomeEmail(
    data:{
        name:string;

        email:string;

    }
){


    return await sendEmail({

        to:
        data.email,


        subject:
        "Selamat datang di GadgetFlow API",



        html:
        `
        <h2>
            Halo ${data.name}
        </h2>


        <p>
            Selamat datang.
            Akun Anda berhasil dibuat.
        </p>


        <p>
            Terima kasih telah bergabung.
        </p>
        `


    });


}








export async function sendResetPasswordEmail(
    data:{
        name:string;

        email:string;

        token:string;

    }
){


    const resetUrl =

    `${process.env.APP_URL}/reset-password?token=${data.token}`;




    return await sendEmail({

        to:
        data.email,



        subject:
        "Reset Password",




        html:
        `

        <h2>
            Halo ${data.name}
        </h2>


        <p>
            Kami menerima permintaan reset password.
        </p>


        <p>
            Klik link berikut:
        </p>


        <a href="${resetUrl}">
            Reset Password
        </a>


        <p>
            Jika Anda tidak meminta reset password,
            abaikan email ini.
        </p>

        `


    });


}