"use server";
interface SubmitQcFilePayload {
  id: number;
  remark: string;
  wrong_file_id: boolean;
  meta_improper: boolean;
  improper_scan: boolean;
  full_rescan: boolean;
  wrong_page_count: boolean;
  corrupt_file: boolean;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const SubmitQcFile = async (
  payload: SubmitQcFilePayload
): Promise<ApiResponseType<file | null>> => {
  const functionname: string = SubmitQcFile.name;

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

    const file_response = await prisma.problem_file.create({
      data: {
        remarks: payload.remark,
        corrupt_file: payload.corrupt_file,
        full_rescan: payload.full_rescan,
        improper_scan: payload.improper_scan,
        meta_improper: payload.meta_improper,
        wrong_file_id: payload.wrong_file_id,
        wrong_page_count: payload.wrong_file_id,
        fileId: is_exist.id,
        status: "PENDING",
      },
    });

    if (!file_response) {
      return createResponse({
        functionname: functionname,
        message: "File problem not updated",
      });
    }

    if (!file_response) {
      return createResponse({
        message: "Failed to update problem files.",
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

export default SubmitQcFile;
