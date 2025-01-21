"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

const GetCompFile = async (): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = GetCompFile.name;

  try {
    const file_response = await prisma.file_base.findMany({
      where: {
        verify_end: {
          not: null,
        },
      },
    });

    if (!file_response) {
      return createResponse({
        message: "No file found",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "File found",
      functionname: functionname,
      data: file_response,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetCompFile;
