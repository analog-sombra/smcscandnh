"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file } from "@prisma/client";

interface SizeData {
  count: number;
  small: number;
  med: number;
  large: number;
}

interface ResponseType {
  fileinhand: number;
  scancount: SizeData;
  qccount: SizeData;
  metacount: SizeData;
}

const GetSupervisorCount = async (): Promise<
  ApiResponseType<ResponseType | null>
> => {
  const functionname: string = GetSupervisorCount.name;

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

    const file_in_hand = await prisma.file_base.count({
      where: {
        NOT: {
          sup_start: null,
        },
        sup_end: null,
      },
    });

    if (!file_in_hand) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    const scancount = await prisma.file_base.findMany({
      where: {
        scan_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        file: true,
      },
    });

    if (!scancount) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let scansmall = 0;
    let scanmed = 0;
    let scanlarge = 0;
    for (let i = 0; i < scancount.length; i++) {
      const file: file[] = scancount[i].file;
      scansmall += parseInt(file[0].small_page_count ?? "0");
      scanmed += parseInt(file[0].mid_page_count ?? "0");
      scanlarge += parseInt(file[0].large_page_count ?? "0");
    }

    const qccount = await prisma.file_base.findMany({
      where: {
        qc_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        file: true,
      },
    });
    if (!qccount) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let qcsmall = 0;
    let qcmed = 0;
    let qclarge = 0;
    for (let i = 0; i < qccount.length; i++) {
      const file: file[] = qccount[i].file;
      qcsmall += parseInt(file[0].small_page_count ?? "0");
      qcmed += parseInt(file[0].mid_page_count ?? "0");
      qclarge += parseInt(file[0].large_page_count ?? "0");
    }

    const metacount = await prisma.file_base.findMany({
      where: {
        meta_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        file: true,
      },
    });
    if (!metacount) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    let metasmall = 0;
    let metamed = 0;
    let metalarge = 0;
    for (let i = 0; i < metacount.length; i++) {
      const file: file[] = metacount[i].file;
      metasmall += parseInt(file[0].small_page_count ?? "0");
      metamed += parseInt(file[0].mid_page_count ?? "0");
      metalarge += parseInt(file[0].large_page_count ?? "0");
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: {
        fileinhand: file_in_hand,
        metacount: {
          count: metacount.length,
          small: metasmall,
          med: metamed,
          large: metalarge,
        },
        qccount: {
          count: qccount.length,
          small: qcsmall,
          med: qcmed,
          large: qclarge,
        },
        scancount: {
          count: scancount.length,
          small: scansmall,
          med: scanmed,
          large: scanlarge,
        },
      },
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetSupervisorCount;
