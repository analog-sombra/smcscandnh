"use server";

import { errorToString } from "@/utils/methods";
import { Status } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

interface ResponseType {
  username: string;
  role: string;
  filecount: number;
  smallpagecount: number;
  medpagecount: number;
  largepagecount: number;
  totalpagecount: number;
}

const GetUserFileData = async (): Promise<
  ApiResponseType<ResponseType[] | null>
> => {
  const functionname: string = GetUserFileData.name;

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

    const qcfile = await prisma.file_base.findMany({
      where: {
        status: Status.ACTIVE,
        is_qc: true,
        qc_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        qc: true,
        file: true,
      },
    });

    if (!qcfile) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    // create a hastmap
    const userfileResponse = new Map<number, ResponseType>();

    for (let i = 0; i < qcfile.length; i++) {
      const role = qcfile[i].qc!.role;
      if (["QC", "SCAN", "META"].includes(role)) {
        // if user id already exist in hashmap then update the value
        if (userfileResponse.has(qcfile[i].qc!.id)) {
          const value = userfileResponse.get(qcfile[i].qc!.id);
          if (value) {
            value.filecount += 1;
            value.smallpagecount += parseInt(
              qcfile[i].file![0].small_page_count ?? "0"
            );
            value.medpagecount += parseInt(
              qcfile[i].file![0].mid_page_count ?? "0"
            );
            value.largepagecount += parseInt(
              qcfile[i].file![0].large_page_count ?? "0"
            );
            value.totalpagecount +=
              parseInt(qcfile[i].file![0].small_page_count ?? "0") +
              parseInt(qcfile[i].file![0].mid_page_count ?? "0") +
              parseInt(qcfile[i].file![0].large_page_count ?? "0");
          }
        } else {
          // if user id not exist in hashmap then create a new value
          userfileResponse.set(qcfile[i].qc!.id, {
            username: qcfile[i].qc!.username,
            role: qcfile[i].qc!.role,
            filecount: 1,
            smallpagecount: parseInt(
              qcfile[i].file![0].small_page_count ?? "0"
            ),
            medpagecount: parseInt(qcfile[i].file![0].mid_page_count ?? "0"),
            largepagecount: parseInt(
              qcfile[i].file![0].large_page_count ?? "0"
            ),
            totalpagecount:
              parseInt(qcfile[i].file![0].small_page_count ?? "0") +
              parseInt(qcfile[i].file![0].mid_page_count ?? "0") +
              parseInt(qcfile[i].file![0].large_page_count ?? "0"),
          });
        }
      }
    }

    const metafile = await prisma.file_base.findMany({
      where: {
        status: Status.ACTIVE,
        is_meta: true,
        meta_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        meta: true,
        file: true,
      },
    });

    if (!metafile) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    for (let i = 0; i < metafile.length; i++) {
      const role = metafile[i].meta!.role;
      if (["META"].includes(role)) {
        // if user id already exist in hashmap then update the value
        if (userfileResponse.has(metafile[i].meta!.id)) {
          const value = userfileResponse.get(metafile[i].meta!.id);
          if (value) {
            value.filecount += 1;
            value.smallpagecount += parseInt(
              metafile[i].file![0].small_page_count ?? "0"
            );
            value.medpagecount += parseInt(
              metafile[i].file![0].mid_page_count ?? "0"
            );
            value.largepagecount += parseInt(
              metafile[i].file![0].large_page_count ?? "0"
            );
            value.totalpagecount +=
              parseInt(metafile[i].file![0].small_page_count ?? "0") +
              parseInt(metafile[i].file![0].mid_page_count ?? "0") +
              parseInt(metafile[i].file![0].large_page_count ?? "0");
          }
        } else {
          // if user id not exist in hashmap then create a new value
          userfileResponse.set(metafile[i].meta!.id, {
            username: metafile[i].meta!.username,
            role: metafile[i].meta!.role,
            filecount: 1,
            smallpagecount: parseInt(
              metafile[i].file![0].small_page_count ?? "0"
            ),
            medpagecount: parseInt(metafile[i].file![0].mid_page_count ?? "0"),
            largepagecount: parseInt(
              metafile[i].file![0].large_page_count ?? "0"
            ),
            totalpagecount:
              parseInt(metafile[i].file![0].small_page_count ?? "0") +
              parseInt(metafile[i].file![0].mid_page_count ?? "0") +
              parseInt(metafile[i].file![0].large_page_count ?? "0"),
          });
        }
      }
    }

    const scanfile = await prisma.file_base.findMany({
      where: {
        status: Status.ACTIVE,
        is_scan: true,
        scan_end: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        scan: true,
        file: true,
      },
    });

    if (!scanfile) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    for (let i = 0; i < scanfile.length; i++) {
      const role = scanfile[i].scan!.role;
      if (["SCAN"].includes(role)) {
        // if user id already exist in hashmap then update the value
        if (userfileResponse.has(scanfile[i].scan!.id)) {
          const value = userfileResponse.get(scanfile[i].scan!.id);
          if (value) {
            value.filecount += 1;
            value.smallpagecount += parseInt(
              scanfile[i].file![0].small_page_count ?? "0"
            );
            value.medpagecount += parseInt(
              scanfile[i].file![0].mid_page_count ?? "0"
            );
            value.largepagecount += parseInt(
              scanfile[i].file![0].large_page_count ?? "0"
            );
            value.totalpagecount +=
              parseInt(scanfile[i].file![0].small_page_count ?? "0") +
              parseInt(scanfile[i].file![0].mid_page_count ?? "0") +
              parseInt(scanfile[i].file![0].large_page_count ?? "0");
          }
        } else {
          // if user id not exist in hashmap then create a new value
          userfileResponse.set(scanfile[i].scan!.id, {
            username: scanfile[i].scan!.username,
            role: scanfile[i].scan!.role,
            filecount: 1,
            smallpagecount: parseInt(
              scanfile[i].file![0].small_page_count ?? "0"
            ),
            medpagecount: parseInt(scanfile[i].file![0].mid_page_count ?? "0"),
            largepagecount: parseInt(
              scanfile[i].file![0].large_page_count ?? "0"
            ),
            totalpagecount:
              parseInt(scanfile[i].file![0].small_page_count ?? "0") +
              parseInt(scanfile[i].file![0].mid_page_count ?? "0") +
              parseInt(scanfile[i].file![0].large_page_count ?? "0"),
          });
        }
      }
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: Array.from(userfileResponse.values()),
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetUserFileData;
