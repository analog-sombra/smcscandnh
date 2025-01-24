"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

interface GetVerifyFilePayload {
  userid: number;
}

const GetVerifyFile = async (
  payload: GetVerifyFilePayload
): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = GetVerifyFile.name;

  try {
    const file_response = await prisma.file_base.findMany({
      where: {
        status: "ACTIVE",
        mod_end: {
          not: null,
        },
        verifyid: payload.userid,
        is_verify: false,
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

    // const files: file[] = [];
    // for (let i = 0; i < file_response.length; i++) {
    //   if (file_response[i].file) {
    //     files.push(file_response[i].file);
    //   }
    // }
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

export default GetVerifyFile;
