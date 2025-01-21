"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

const NECCompFiles = async (): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = NECCompFiles.name;

  try {
    const response = await prisma.file_base.findMany({
      where: {
        sup_end: {
          not: null,
        },
        status: "ACTIVE",
      },
      include: {
        file: true,
      },
    });

    if (!response) {
      return createResponse({
        message: "NO file found to take",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "File take",
      functionname: functionname,
      data: response,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default NECCompFiles;
