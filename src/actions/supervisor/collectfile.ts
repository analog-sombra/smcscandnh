"use server";
interface CollectFilePayload {
  count: number;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { Status } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const CollectFile = async (
  payload: CollectFilePayload
): Promise<ApiResponseType<boolean | null>> => {
  const functionname: string = CollectFile.name;

  try {
    let lastid: string = "800001";
    const lastfile = await prisma.file_base.findFirst({
      orderBy: { id: "desc" },
    });
    if (lastfile) {
      lastid = (parseInt(lastfile.fileid) + 1).toString();
    }

    const data_to_create: {
      fileid: string;
      createdAt: Date;
      updatedAt: Date;
      createdById: number;
      is_sup: boolean;
      is_mod: boolean;
      is_scan: boolean;
      is_meta: boolean;
      is_qc: boolean;
      is_verify: boolean;
      status: Status;
      supid: number;
      sup_start: Date;
    }[] = Array.from({ length: payload.count }, (_, i) => ({
      fileid: (parseInt(lastid) + i).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: payload.created_by,
      is_sup: true,
      is_mod: false,
      is_scan: false,
      is_meta: false,
      is_qc: false,
      is_verify: false,
      status: Status.ACTIVE,
      supid: payload.created_by,
      sup_start: new Date(),
    }));

    const base_file_create = await prisma.file_base.createMany({
      data: data_to_create,
      skipDuplicates: true,
    });

    if (!base_file_create) {
      return createResponse({
        message: "Failed to create files.",
        functionname: functionname,
      });
    }

    // Fetch the created file_base records to use their IDs
    const createdFileBases = await prisma.file_base.findMany({
      where: {
        fileid: { in: data_to_create.map((file) => file.fileid) },
      },
    });

    if (!createdFileBases) {
      return createResponse({
        message: "Failed to fetch created files.",
        functionname: functionname,
      });
    }

    // Map the `file_base` records to create corresponding `file` entries
    const file_create = await prisma.file.createMany({
      data: createdFileBases.map((fileBase) => ({
        fileid: fileBase.fileid,
        createdAt: new Date(),
        createdById: payload.created_by,
        updatedAt: new Date(),
        status: Status.ACTIVE,
        filebaseId: fileBase.id, // Link to the `file_base` record
      })),
    });

    if (!file_create) {
      return createResponse({
        message: "Failed to create files.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files created successfully.",
      functionname: functionname,
      data: true,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default CollectFile;
