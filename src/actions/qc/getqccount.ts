"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file } from "@prisma/client";

interface GetQcCountPayload {
  userid: number;
}

interface ResponseType {
  filecount: number;
  pagecount: number;
}

const GetQcCount = async (
  payload: GetQcCountPayload
): Promise<ApiResponseType<ResponseType | null>> => {
  const functionname: string = GetQcCount.name;

  try {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59
    );

    const file_count = await prisma.file_base.findMany({
      where: {
        qcid: payload.userid,
        qc_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: "ACTIVE",
      },
      include: {
        file: true,
      },
    });

    if (!file_count) {
      return createResponse({
        message: "Something want wrong",
        functionname: functionname,
      });
    }

    let total = 0;
    for (let i = 0; i < file_count.length; i++) {
      const file: file[] = file_count[i].file;
      total += parseInt(file[0].small_page_count ?? "0");
      total += parseInt(file[0].mid_page_count ?? "0");
      total += parseInt(file[0].large_page_count ?? "0");
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: {
        filecount: file_count.length,
        pagecount: total,
      },
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetQcCount;
