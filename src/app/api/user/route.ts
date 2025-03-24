import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { name, email, password } = body;

        const existingUseremail = await prisma.user.findUnique({
            where: {email: email}
        });
        if(existingUseremail){
            return NextResponse.json({user: null, message: "User with this email already exists"}, {status: 409});
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json( {user: rest, message:"User created successfully"},{status: 201});
    }catch(error){
        return NextResponse.json({user: null, message: "Something went wrong"}, {status: 500});
    }    
}