import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/jwt";


export function authenticate(request: NextRequest) {

    const authHeader =
        request.headers.get("authorization");


    console.log(
        "AUTH HEADER:",
        authHeader
    );


    if (!authHeader) {
        return null;
    }


    const token =
        authHeader.split(" ")[1];


    console.log(
        "TOKEN:",
        token
    );


    if (!token) {
        return null;
    }


    try {

        const payload =
            verifyToken(token) as {
                id:number;
                email:string;
                role:string;
            };


        console.log(
            "PAYLOAD:",
            payload
        );


        return payload;


    } catch(error) {

        console.log(
            "JWT ERROR:",
            error
        );


        return null;

    }
}