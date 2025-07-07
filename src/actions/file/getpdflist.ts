"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import path from "path";
import { readdir } from "fs/promises";
interface filedata {
  id: number;
  name: string;
  path: string;
}

interface GetPdfFilesPayload {
  location: string;
}

const GetPdfFiles = async (
  payload: GetPdfFilesPayload
): Promise<ApiResponseType<filedata[] | null>> => {
  try {
    const filepath = path.join(
      process.env.FILE_LOCATIONS ?? "",
      payload.location.toString()
    );

    const files = await readdir(filepath, "utf-8");

    interface filedata {
      id: number;
      name: string;
      path: string;
    }

    let filesdata: filedata[] = [];

    for (let i = 0; i < files.length; i++) {
      const filedata: filedata = {
        id: i + 1,
        name: files[i],
        path: path.join(filepath, files[i]),
      };
      filesdata.push(filedata);
    }
    return {
      status: true,
      data: filesdata,
      message: "Invalid file id. Please try again.",
      functionname: "GetPdfFiles",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetPdfFiles",
    };
    return response;
  }
};

export default GetPdfFiles;
