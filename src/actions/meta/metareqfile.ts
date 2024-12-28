"use server";
interface MetaRequestFilePayload {
  count: number;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file_base, Status } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const MetaRequestFile = async (
  payload: MetaRequestFilePayload
): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = MetaRequestFile.name;

  if (payload.count >= 26) {
    return createResponse({
      message: "Count should be less than 25.",
      functionname: functionname,
    });
  }

  try {
    const file_response = await prisma.file_base.findMany({
      where: {
        status: Status.ACTIVE,
        is_meta: false,
        NOT: {
          mod_end: null,
        },
      },
      orderBy: {
        fileid: "asc",
      },
    });

    if (file_response.length < payload.count) {
      return createResponse({
        message:
          "Not enough files available. currently available files are " +
          file_response.length,
        functionname: functionname,
      });
    }

    const update_response = await prisma.file_base.updateMany({
      where: {
        id: {
          in: file_response.slice(0, payload.count).map((file) => file.id),
        },
      },
      data: {
        is_meta: true,
        meta_start: new Date(),
        metaid: payload.created_by,
      },
    });

    if (update_response.count !== payload.count) {
      return createResponse({
        message: "Failed to update files.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files created successfully.",
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

export default MetaRequestFile;
