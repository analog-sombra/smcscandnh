"use server";
interface ScaneerRequestFilePayload {
  count: number;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file_base, Status } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const ScaneerRequestFile = async (
  payload: ScaneerRequestFilePayload
): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = ScaneerRequestFile.name;

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
        is_sup: true,
        is_mod: false,
      },
      orderBy: {
        fileid: "asc",
      },
    });

    const count_response = await prisma.file_base.count({
      where: {
        scanid: payload.created_by,
        scan_end: null,
        status: "ACTIVE",
        is_mod: true,
        is_sup: true,
      },
    });

    if (count_response > 5) {
      return createResponse({
        message: "You can't request files.",
        functionname: functionname,
      });
    }

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
        is_mod: true,
        modid: 4,
        mod_start: new Date(),
        scanid: payload.created_by,
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

export default ScaneerRequestFile;
