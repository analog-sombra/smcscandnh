"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_type } from "@prisma/client";

const GetFileType = async (): Promise<ApiResponseType<file_type[] | null>> => {
  const functionname: string = GetFileType.name;

  try {
    const file_type = await prisma.file_type.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!file_type) {
      return createResponse({
        functionname: functionname,
        message: "No file type found",
      });
    }

    return createResponse({
      functionname: functionname,
      message: "File type found",
      data: file_type,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetFileType;
