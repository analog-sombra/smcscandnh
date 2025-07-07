"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { hash, compare } from "bcrypt";
import { user } from "@prisma/client";
import prisma from "../../../prisma/database";

interface ChangePasswordPayload {
  id: number;
  password: string;
}

const ChangePassword = async (
  payload: ChangePasswordPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: parseInt(payload.id.toString() ?? "0"), status: "ACTIVE" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "user not exists. Please try again.",
        functionname: "ChangePassword",
      };

    const ispasswordmatch = await compare(
      payload.password,
      user.password ?? ""
    );

    if (ispasswordmatch) {
      return {
        status: false,
        data: null,
        message: "You can't use the old password",
        functionname: "ChangePassword",
      };
    }

    const newpassword = await hash(payload.password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
      data: {
        password: newpassword,
      },
    });

    if (!updatedUser)
      return {
        status: false,
        data: null,
        message: "User not created",
        functionname: "ChangePassword",
      };

    return {
      status: true,
      data: updatedUser,
      message: "User password updated successfully",
      functionname: "ChangePassword",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ChangePassword",
    };
    return response;
  }
};

export default ChangePassword;
