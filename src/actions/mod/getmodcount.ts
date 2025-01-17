"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

interface GetMetaCountPayload {
  userid: number;
}

interface ResponseType {
  in_scan: number;
  pending_take: number;
  pending_give: number;
}

const GetModCount = async (
  payload: GetMetaCountPayload
): Promise<ApiResponseType<ResponseType | null>> => {
  const functionname: string = GetModCount.name;
  console.log(payload);

  try {
    const in_scan = await prisma.file_base.count({
      where: {
        modid: payload.userid,
        scan_end: null,
        scan_start: {
          not: null,
        },
        status: "ACTIVE",
      },
    });

    const pending_give = await prisma.file_base.count({
      where: {
        modid: payload.userid,
        scan_start: null,
        mod_start: {
          not: null,
        },
        status: "ACTIVE",
      },
    });

    const pending_take = await prisma.file_base.count({
      where: {
        modid: payload.userid,
        mod_end: null,
        scan_end: {
          not: null,
        },
        status: "ACTIVE",
      },
    });

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: {
        in_scan: in_scan,
        pending_give: pending_give,
        pending_take: pending_take,
      },
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetModCount;
