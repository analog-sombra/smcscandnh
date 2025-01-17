"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType, createResponse } from "@/models/response";
import { file_base, user } from "@prisma/client";

interface GetModRequestPayload {
  userid: number;
}

interface ModFileRequestResponse {
  count: number;
  given: number;
  taken: number;
  files: file_base[];
  date: Date;
  name: string;
}

const GetModRequest = async (
  payload: GetModRequestPayload
): Promise<ApiResponseType<ModFileRequestResponse[] | null>> => {
  const functionname: string = GetModRequest.name;

  try {
    const file_response = await prisma.file_base.findMany({
      where: {
        modid: payload.userid,
        // mod_end: null,
        status: "ACTIVE",
        is_mod: true,
        is_sup: true,
        mod_start: {
          not: null,
        },
      },
      include: {
        scan: true,
      },
    });

    if (!file_response) {
      return createResponse({
        message: "No file found",
        functionname: functionname,
      });
    }

    // Use a hashtable to organize the data by date or any other criteria
    const groupedByDate: Record<string, ModFileRequestResponse> = {};

    file_response.forEach((file: file_base & { scan: user | null }) => {
      const dateKey = file.mod_start!.toISOString() || "unknown";

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          count: 0,
          given: 0,
          taken: 0,
          files: [],
          date: file.mod_start!,
          name: file.scan!.username || "unknown",
        };
      }

      groupedByDate[dateKey].files.push(file);
      groupedByDate[dateKey].count += 1;

      if (file.scan_start != null) {
        groupedByDate[dateKey].given += 1;
      }
      if (file.mod_end != null) {
        groupedByDate[dateKey].taken += 1;
      }
    });

    const result: ModFileRequestResponse[] = Object.values(groupedByDate);

    return createResponse({
      message: "File found",
      functionname: functionname,
      data: result,
    });
  } catch (e) {
    return createResponse({
      message: errorToString(e),
      functionname: functionname,
    });
  }
};

export default GetModRequest;
