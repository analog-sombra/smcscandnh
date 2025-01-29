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
  metasmall: number;
  metamed: number;
  metalarge: number;
  inscansmall: number;
  inscanmed: number;
  inscanlarge: number;
  scaned_file: number;
  meta_file: number;
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
    const meta_file = await prisma.file_base.findMany({
      where: {
        meta_end: {
          not: null,
        },
        status: "ACTIVE",
      },
      include: {
        file: true,
      },
    });

    if (!meta_file) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let metasmall = 0;
    let metamed = 0;
    let metalarge = 0;
    for (let i = 0; i < meta_file.length; i++) {
      const file: file[] = meta_file[i].file;
      metasmall += parseInt(file[0].small_page_count ?? "0");
      metamed += parseInt(file[0].mid_page_count ?? "0");
      metalarge += parseInt(file[0].large_page_count ?? "0");
    }
    const inscan_file = await prisma.file_base.findMany({
      where: {
        scan_end: {
          not: null,
        },
        status: "ACTIVE",
      },
      include: {
        file: true,
      },
    });

    if (!inscan_file) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let inscansmall = 0;
    let inscanmed = 0;
    let inscanlarge = 0;
    for (let i = 0; i < inscan_file.length; i++) {
      const file: file[] = inscan_file[i].file;
      inscansmall += parseInt(file[0].small_page_count ?? "0");
      inscanmed += parseInt(file[0].mid_page_count ?? "0");
      inscanlarge += parseInt(file[0].large_page_count ?? "0");
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
        metasmall: metasmall,
        metamed: metamed,
        metalarge: metalarge,
        inscansmall: inscansmall,
        inscanmed: inscanmed,
        inscanlarge: inscanlarge,
        scaned_file: inscan_file.length,
        meta_file: meta_file.length,
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
