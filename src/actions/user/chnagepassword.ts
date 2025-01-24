"use server";
interface ChangePasswordPayload {
  id: number;
  password: string;
}

import * as argon2 from "argon2";
import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { user } from "@prisma/client";

const ChangePassword = async (
  payload: ChangePasswordPayload
): Promise<ApiResponseType<user | null>> => {
  const functionname: string = ChangePassword.name;

  try {
    const user = await prisma.user.findFirst({
      where: { id: payload.id, status: "ACTIVE" },
    });

    if (!user) {
      return createResponse({
        message: "Invalid Credentials. Please try again.",
        functionname: functionname,
      });
    }

    const password = await argon2.hash(payload.password);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: password },
    });

    if (!updatedUser) {
      return createResponse({
        message: "Unable to update password.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Invalid Credentials. Please try again.",
      functionname: functionname,
      data: updatedUser,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default ChangePassword;
