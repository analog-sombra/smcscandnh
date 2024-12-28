"use server";
interface SubmitMetaFilePayload {
  id: number;
  villageId: number;
  filetypeId: number;
  year: string;
  name: string;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const SubmitMetaFile = async (
  payload: SubmitMetaFilePayload
): Promise<ApiResponseType<file | null>> => {
  const functionname: string = SubmitMetaFile.name;

  try {
    const is_exist = await prisma.file.findFirst({
      where: {
        status: "ACTIVE",
        id: payload.id,
      },
    });

    if (!is_exist) {
      return createResponse({
        functionname: functionname,
        message: "File not found",
      });
    }

    const file_response = await prisma.file.update({
      where: {
        id: is_exist.id,
      },
      data: {
        year: payload.year,
        villageId: payload.villageId,
        file_typeId: payload.filetypeId,
        filename: payload.name,
        updatedById: payload.created_by,
      },
    });

    if (!file_response) {
      return createResponse({
        functionname: functionname,
        message: "File not updated",
      });
    }

    if (!file_response) {
      return createResponse({
        message: "Failed to update files.",
        functionname: functionname,
      });
    }

    const update_file_base = await prisma.file_base.update({
      where: {
        id: payload.id,
      },
      data: {
        meta_end: new Date(),
      },
    });

    if (!update_file_base) {
      return createResponse({
        message: "Failed to update files.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files updated successfully.",
      functionname: functionname,
      data: is_exist,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default SubmitMetaFile;
