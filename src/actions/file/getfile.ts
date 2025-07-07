"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

interface GetFilePayload {
  id: number;
}

const GetFile = async (
  payload: GetFilePayload
): Promise<ApiResponseType<file | null>> => {
  try {
    const file = await prisma.file.findFirst({
      where: { id: parseInt(payload.id.toString()) },
      include: {
        village: true,
        file_type: true,
        file_name: true,
        file_survey: true,
        physical_file_location: true,
      },
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Invalid file id. Please try again.",
        functionname: "GetFile",
      };

    return {
      status: true,
      data: file,
      message: "File data get successfully",
      functionname: "GetFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetFile",
    };
    return response;
  }
};

export default GetFile;
