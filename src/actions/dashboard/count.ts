"use server";

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";

interface DashBoardCountPayload {}

const DashBoardCount = async (
  payload: DashBoardCountPayload
): Promise<ApiResponseType<{ [key: string]: number } | null>> => {
  try {
    const villagecout = await prisma.village.count();
    const typecout = await prisma.file_type.count();
    const filecout = await prisma.file.count();

    const files = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
    });

    const totalPageCount = files
      .map((file) => parseInt(file.small_page_count ?? "0", 10))
      .reduce((acc, count) => acc + count, 0);

    const totalMapCount = files
      .map((file) => parseInt(file.large_page_count ?? "0", 10))
      .reduce((acc, count) => acc + count, 0);

    const response = {
      village: villagecout,
      type: typecout,
      file: filecout,
      page: totalPageCount,
      map: totalMapCount,
    };

    return {
      status: true,
      data: response,
      message: "File data get successfully",
      functionname: "DashBoardCount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DashBoardCount",
    };
    return response;
  }
};

export default DashBoardCount;
