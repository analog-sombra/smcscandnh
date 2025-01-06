"use server";
interface GetScanFilePayload {
  userid: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base } from "@prisma/client";

const GetScanFile = async (
  payload: GetScanFilePayload
): Promise<ApiResponseType<file_base[] | null>> => {
  const functionname: string = GetScanFile.name;

  try {
    // order first is_scan true and then order by mod_start desc
    const file_response = await prisma.file_base.findMany({
      where: {
        scanid: payload.userid,
        scan_end: null,
        status: "ACTIVE",
        is_mod: true,
        is_sup: true,
      },
      orderBy: [
        {
          scan_start: "desc",
        },
        {
          mod_start: "desc",
        },
      ],
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

export default GetScanFile;
