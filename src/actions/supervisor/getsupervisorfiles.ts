"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base, user } from "@prisma/client";

interface ResponseType {
  qcfiles: Array<file_base & { qc: user | null }>;
  metafiles: Array<file_base & { meta: user | null }>;
  scanefiles: Array<file_base & { scan: user | null }>;
  modfiles: Array<file_base & { scan: user | null }>;
}

const GetSupervisorFiles = async (): Promise<
  ApiResponseType<ResponseType | null>
> => {
  const functionname: string = GetSupervisorFiles.name;

  try {
    const qcfiles = await prisma.file_base.findMany({
      where: {
        NOT: {
          qc_start: null,
        },
        qc_end: null,
        status: "ACTIVE",
      },
      include: {
        qc: true,
      },
    });

    if (!qcfiles) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    const metafiles = await prisma.file_base.findMany({
      where: {
        NOT: {
          meta_start: null,
        },
        meta_end: null,
        status: "ACTIVE",
      },
      include: {
        meta: true,
      },
    });

    if (!metafiles) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    const scanfiles = await prisma.file_base.findMany({
      where: {
        NOT: {
          scan_start: null,
        },
        scan_end: null,
        status: "ACTIVE",
      },
      include: {
        scan: true,
      },
    });

    if (!scanfiles) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }
    const modfiles = await prisma.file_base.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                scan_end: { not: null },
              },
              {
                mod_end: null,
              },
              {
                meta_start: null,
              },
              {
                status: "ACTIVE",
              },
            ],
          },
          {
            AND: [{ is_mod: true }, { is_scan: false }],
          },
        ],
      },
      include: {
        scan: true,
      },
    });

    if (!modfiles) {
      return createResponse({
        message: "Something went wrong",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: {
        qcfiles: qcfiles,
        metafiles: metafiles,
        scanefiles: scanfiles,
        modfiles: modfiles,
      },
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetSupervisorFiles;
