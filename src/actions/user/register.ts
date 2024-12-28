"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { user } from "@prisma/client";
import { cookies } from "next/headers";
import * as argon2 from "argon2";

interface RegisterPayload {
  username: string;
  password: string;
}
const Register = async (
  payload: RegisterPayload
): Promise<ApiResponseType<user | null>> => {
  const functionname: string = Register.name;

  try {
    const user = await prisma.user.findFirst({
      where: { username: payload.username, status: "ACTIVE" },
    });

    if (user){
      return createResponse({
        message: "Username already exists. Please try another username.",
        functionname: functionname,
      });
    }

    const newpassword = await argon2.hash(payload.password);
    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        password: newpassword,
        role: "USER",
      },
    });

    if (!newUser) {
      return createResponse({
        message: "User not created",
        functionname: functionname,
      });
    }

    const cookieStore = await cookies();
    cookieStore.set("id", newUser.id.toString(), {
      domain: "/smcscandhn",
    });
    cookieStore.set("role", newUser.role.toString(), {
      domain: "/smcscandhn",
    });

    return createResponse({
      message: "User register successfully",
      functionname: functionname,
      data: newUser,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default Register;
