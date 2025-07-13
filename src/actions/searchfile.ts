/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
interface SearchFilePayload {
  typeId?: number;
  villageId?: number;
  file_id?: string;
  file_title?: string;
  old_file_no?: string;
  fts_no?: string;
  file_name?: string;
  survey?: string;
  plot?: string;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";
import Fuse from "fuse.js";

const fileSearch = async (
  payload: SearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: any[] = [];

    const fileresponse = await prisma.file.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        file_type: true,
        village: true,
      },
    });

    if (!fileresponse) {
      return {
        status: false,
        data: null,
        message: "Unable to get files",
        functionname: "MatchSearch",
      };
    }

    files = fileresponse.map((file: any) => {
      const file_survery = file.survey_number;
      file.survey_number = [file_survery];

      return file;
    });

    const fileMap = new Map<number, any>();

    // Populate the map with the files
    files.forEach((file) => fileMap.set(file.id, file));

    files = Array.from(fileMap.values());

    for (let i = 0; i < files.length; i++) {
      files[i].survey_number = files[i].survey_number.join(", ");
    }

    // -------------------------------------------------------

    console.log(files.length, "files length");
    console.log(payload, "payload length");

    // check file id
    if (payload.typeId) {
      files = files.filter((file: any) => file.file_typeId == payload.typeId);
    }
    console.log(files.length, "files length");
    // check village id
    if (payload.villageId) {
      files = files.filter((file: any) => file.villageId == payload.villageId);
    }

    // check year
    // if (payload.file_name) {
    //   files = files.filter((file: any) => file.filename == payload.file_name);
    // }

    // check file id
    if (payload.file_id) {
      files = files.filter((file: any) => file.fileid == payload.file_id);
    }

    // // check file no
    // if (payload.file_no) {
    //   files = files.filter((file: any) => file.file_no == payload.file_no);
    // }

    // // check file ref
    // if (payload.file_ref) {
    //   files = files.filter((file: any) => file.file_ref == payload.file_ref);
    // }

    if (payload.survey) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["survey_no"],
      });
      const searchresult = fuse.search(payload.survey);
      files = searchresult.map((result: any) => result.item);
    }

    if (payload.plot) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["plot_no"],
      });
      const searchresult = fuse.search(payload.plot);
      files = searchresult.map((result: any) => result.item);
    }

    // if (payload.file_id) {
    //   const fuse = new Fuse(files, {
    //     isCaseSensitive: false,
    //     threshold: 0.2,
    //     keys: ["fileid"],
    //   });
    //   const searchresult = fuse.search(payload.file_id);
    //   files = searchresult.map((result: any) => result.item);
    // }
    if (payload.file_title) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["file_no"],
      });
      const searchresult = fuse.search(payload.file_title);
      files = searchresult.map((result: any) => result.item);
    }
    if (payload.file_name) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["filename"],
      });
      const searchresult = fuse.search(payload.file_name);
      files = searchresult.map((result: any) => result.item);
    }
    if (payload.old_file_no) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["old_file_no"],
      });
      const searchresult = fuse.search(payload.old_file_no);
      files = searchresult.map((result: any) => result.item);
    }
    if (payload.fts_no) {
      const fuse = new Fuse(files, {
        isCaseSensitive: false,
        threshold: 0.2,
        keys: ["fts_no"],
      });
      const searchresult = fuse.search(payload.fts_no);
      files = searchresult.map((result: any) => result.item);
    }

    console.log("files", files);

    files = files.map((file: any) => {
      const file_survery = file.survey_number;
      file.survey_number = file_survery.split(", ")[0];
      return file;
    });

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "MatchSearch",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "fileSearch",
    };
    return response;
  }
};

export default fileSearch;
