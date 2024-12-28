"use server";
interface SubmitScanPayload {
  id: number;
  size1: string;
  size2: string;
  size3: string;
  created_by: number;
}

import { errorToString } from "@/utils/methods";
import { file_base } from "@prisma/client";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";

const SubmitScan = async (
  payload: SubmitScanPayload
): Promise<ApiResponseType<file_base | null>> => {
  const functionname: string = SubmitScan.name;
  try {
    const is_exist = await prisma.file_base.findFirst({
      where: {
        status: "ACTIVE",
        id: payload.id,
      },
      include: {
        file: true,
      },
    });

    if (!is_exist) {
      return createResponse({
        message: "File not found.",
        functionname: functionname,
      });
    }

    const update_respnse = await prisma.file_base.update({
      where: {
        id: is_exist.id,
      },
      data: {
        updatedById: payload.created_by,
        scan_end: new Date(),
      },
    });

    if (!update_respnse) {
      return createResponse({
        message: "Failed to update file.",
        functionname: functionname,
      });
    }

    // Update each file in `is_exist.file`
    const update_file_responses = await Promise.all(
      is_exist.file.map((file) =>
        prisma.file.update({
          where: {
            id: file.id,
          },
          data: {
            small_page_count: payload.size1,
            mid_page_count: payload.size2,
            large_page_count: payload.size3,
          },
        })
      )
    );

    if (update_file_responses.length == 0) {
      return createResponse({
        message: "Failed to update any files.",
        functionname: functionname,
      });
    }

    return createResponse({
      message: "Files created successfully.",
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

export default SubmitScan;
