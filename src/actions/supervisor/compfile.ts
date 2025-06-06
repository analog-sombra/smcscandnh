"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

interface CompFilesPayload {
  files: file_base[];
}

const CompFiles = async (
  payload: CompFilesPayload
): Promise<ApiResponseType<boolean | null>> => {
  const functionname: string = CompFiles.name;

  try {
    const update_response = await prisma.file_base.updateMany({
      where: {
        id: {
          in: payload.files.map((file) => file.id),
        },
      },
      data: {
        sup_end: new Date(),
      },
    });

    if (!update_response) {
      return createResponse({
        message: "NO file found to take",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "File take",
      functionname: functionname,
      data: true,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default CompFiles;
