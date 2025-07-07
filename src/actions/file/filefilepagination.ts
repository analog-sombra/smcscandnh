"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface GetAllFilesPagenetedPayload {
  skip: number;
  take: number;
}

const GetAllFilesPageneted = async (
  payload: GetAllFilesPagenetedPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const fileCount = await prisma.file.count({
      where: {
        deletedAt: null,
      },
    });
    if (fileCount === 0) {
      return {
        status: false,
        data: null,
        message: "No files found",
        functionname: "GetAllFilesPageneted",
      };
    }
    const file = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        village: true,
        file_name: true,
        file_survey: true,
        file_type: true,
        department: true,
      },
      skip: payload.skip,
      take: payload.take,
    });

    if (!file)
      return {
        status: false,
        data: null,
        message: "Invalid file id. Please try again.",
        functionname: "GetAllFilesPageneted",
      };

    //   add count in response
    const allfiles_with_count = {
      count: fileCount,
      files: file,
    };

    return {
      status: true,
      data: allfiles_with_count,
      message: "File data get successfully",
      functionname: "GetAllFilesPageneted",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllFilesPageneted",
    };
    return response;
  }
};

export default GetAllFilesPageneted;
