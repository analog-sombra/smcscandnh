"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

interface ModGiveFilesPayload {
  files: file_base[];
}

const ModGiveFiles = async (
  payload: ModGiveFilesPayload
): Promise<ApiResponseType<boolean | null>> => {
  const functionname: string = ModGiveFiles.name;

  try {
    const update_response = await prisma.file_base.updateMany({
      where: {
        id: {
          in: payload.files.map((file) => file.id),
        },
      },
      data: {
        is_scan: true,
        scan_start: new Date(),
      },
    });

    if (!update_response) {
      return createResponse({
        message: "NO file found to give",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "File give",
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

export default ModGiveFiles;
