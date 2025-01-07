"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file } from "@prisma/client";

const GetVerifyFile = async (): Promise<ApiResponseType<file[] | null>> => {
  const functionname: string = GetVerifyFile.name;

  try {
    const file_response = await prisma.problem_file.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        file: true,
      },
    });

    if (!file_response) {
      return createResponse({
        message: "No file found",
        functionname: functionname,
      });
    }

    const files: file[] = [];
    for (let i = 0; i < file_response.length; i++) {
      if (file_response[i].file) {
        files.push(file_response[i].file);
      }
    }
    return createResponse({
      message: "File found",
      functionname: functionname,
      data: files,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetVerifyFile;
