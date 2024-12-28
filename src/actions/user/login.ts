"use server";
interface LoginPayload {
  username: string;
  password: string;
}

import * as argon2 from "argon2";
import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { user } from "@prisma/client";
import { cookies } from "next/headers";

const login = async (
  payload: LoginPayload
): Promise<ApiResponseType<user | null>> => {
  const functionname: string = login.name;

  try {
    const user = await prisma.user.findFirst({
      where: { username: payload.username, status: "ACTIVE" },
    });

    if (!user) {
      return createResponse({
        message: "Invalid Credentials. Please try again.",
        functionname: functionname,
      });
    }

    const password = await argon2.verify(user.password, payload.password);

    if (!password) {
      return createResponse({
        message: "Invalid Credentials. Please try again.",
        functionname: functionname,
      });
    }

    const cookieStore = await cookies();
    cookieStore.set("id", user.id.toString());
    cookieStore.set("role", user.role.toString());

    return createResponse({
      message: "Invalid Credentials. Please try again.",
      functionname: functionname,
      data: user,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default login;
