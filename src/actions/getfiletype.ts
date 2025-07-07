"use server";
interface GetFileTypePayload {}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file_type } from "@prisma/client";

const getFileType = async (
  payload: GetFileTypePayload
): Promise<ApiResponseType<file_type[] | null>> => {
  try {
    const file_type = await prisma.file_type.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!file_type)
      return {
        status: false,
        data: null,
        message: "Something want wrong. Please try again.",
        functionname: "getFileType",
      };

    return {
      status: true,
      data: file_type,
      message: "File type get successfully",
      functionname: "getFileType",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getFileType",
    };
    return response;
  }
};

export default getFileType;
