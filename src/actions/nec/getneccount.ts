"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file } from "@prisma/client";

interface ResponseType {
  runing_file: number;
  completed_file: number;
  scansmall: number;
  scanmed: number;
  scanlarge: number;
}

const GetNECCount = async (): Promise<ApiResponseType<ResponseType | null>> => {
  const functionname: string = GetNECCount.name;

  try {
    const running_file = await prisma.file_base.count({
      where: {
        sup_start: {
          not: null,
        },
        sup_end: null,
        status: "ACTIVE",
      },
    });

    const completed_file = await prisma.file_base.findMany({
      where: {
        sup_end: {
          not: null,
        },
        status: "ACTIVE",
      },
      include: {
        file: true,
      },
    });

    if (!completed_file) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let scansmall = 0;
    let scanmed = 0;
    let scanlarge = 0;
    for (let i = 0; i < completed_file.length; i++) {
      const file: file[] = completed_file[i].file;
      scansmall += parseInt(file[0].small_page_count ?? "0");
      scanmed += parseInt(file[0].mid_page_count ?? "0");
      scanlarge += parseInt(file[0].large_page_count ?? "0");
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: {
        runing_file: running_file,
        completed_file: completed_file.length,
        scansmall: scansmall,
        scanmed: scanmed,
        scanlarge: scanlarge,
      },
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetNECCount;
