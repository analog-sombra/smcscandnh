"use server";

enum SearchType {
  VILLAGE_FILENAME,
  VILLAGE_SURVAY,
  FILETYPE_VILLAGE,
  FILETYPE_FILENAME,
}

interface ASearchFilePayload {
  searchtype: SearchType;
  file_no?: string;
  file_id?: string;
  file_name?: string;
  survey_number?: string;
  remarks?: string;
  typeId?: number;
  villageId?: number;
}

import { errorToString } from "@/utils/methods";
import prisma from "../../../prisma/database";
import { ApiResponseType } from "@/models/response";
import { file } from "@prisma/client";

const ASearchFile = async (
  payload: ASearchFilePayload
): Promise<ApiResponseType<file[] | null>> => {
  try {
    let files: file[] = [];

    // file number search
    if (payload.file_no) {
      const file_no = await prisma.file.findMany({
        where: {
          deletedAt: null,
          file_no: payload.file_no,
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (file_no) {
        files = [...files, ...file_no];
      }
    }
    // file id search
    if (payload.file_id) {
      const file_id = await prisma.file.findMany({
        where: {
          deletedAt: null,
          fileid: payload.file_id,
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (file_id) {
        files = [...files, ...file_id];
      }
    }

    // remarks search
    if (payload.remarks) {
      const remarks = await prisma.file.findMany({
        where: {
          deletedAt: null,
          remarks: {
            contains: payload.remarks,
          },
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (remarks) {
        files = [...files, ...remarks];
      }
    }

    // type search

    if (payload.typeId) {
      const type = await prisma.file.findMany({
        where: {
          deletedAt: null,
          file_typeId: parseInt(payload.typeId.toString() ?? "0"),
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (type) {
        files = [...files, ...type];
      }
    }

    // village search
    if (payload.villageId) {
      const village = await prisma.file.findMany({
        where: {
          deletedAt: null,
          villageId: parseInt(payload.villageId.toString() ?? "0"),
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (village) {
        files = [...files, ...village];
      }
    }

    // search name

    if (payload.file_name) {
      const filename = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.file_name,
          },
        },
        include: {
          village: true,
          file_type: true,
        },
      });

      if (filename) {
        files = [...files, ...filename];
      }

      files = [...files];
    }

    // search survey number
    if (payload.survey_number) {
      const survey = await prisma.file.findMany({
        where: {
          deletedAt: null,
          survey_no: {
            contains: payload.survey_number,
          },
        },
      });

      if (survey) {
        files = [...files, ...survey];
      }
    }

    if (payload.searchtype == SearchType.FILETYPE_FILENAME) {
      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.file_name,
          },
        },
        include: {
          file_type: true,
          village: true,
        },
      });

      const all_search_file = [...search_files2];

      files = all_search_file.filter((f) => f.file_typeId == payload.typeId);
    } else if (payload.searchtype == SearchType.FILETYPE_VILLAGE) {
      // done
      files = files.filter(
        (f) =>
          f.file_typeId == payload.typeId && f.villageId == payload.villageId
      );
    } else if (payload.searchtype == SearchType.VILLAGE_FILENAME) {
      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          filename: {
            contains: payload.file_name,
          },
        },
        include: {
          file_type: true,
          village: true,
        },
      });
      const all_search_file = [...search_files2];

      files = all_search_file.filter((f) => f.villageId == payload.villageId);
    } else if (payload.searchtype == SearchType.VILLAGE_SURVAY) {
      const search_files2 = await prisma.file.findMany({
        where: {
          deletedAt: null,
          survey_no: payload.survey_number,
        },
        include: {
          file_type: true,
          village: true,
        },
      });
      const all_search_file = [...search_files2];

      files = all_search_file.filter((f) => f.villageId == payload.villageId);
    }

    files = files.filter(
      (v, i, a) => a.findIndex((t) => t.fileid === v.fileid) === i
    );

    return {
      status: true,
      data: files,
      message: "File data get successfully",
      functionname: "ASearchFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ASearchFile",
    };
    return response;
  }
};

export default ASearchFile;
