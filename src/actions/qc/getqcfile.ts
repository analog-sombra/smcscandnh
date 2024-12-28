"use server";
interface GetQcFilePayload {
  userid: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

const GetQcFile = async (
  payload: GetQcFilePayload
): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = GetQcFile.name;

  try {
    const file_response = await prisma.file_base.findMany({
      where: {
        qcid: payload.userid,
        qc_end: null,
        status: "ACTIVE",
        is_qc: true,
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

export default GetQcFile;
