"use server";
interface SubmitMetaFilePayload {
  id: number;
  villageId: number;
  filetypeId: number;
  created_by: number;
  file_color: string;
  file_name: string;
  applicant_name: string;
  fts_no: string;
  file_ref_no: string;
  file_subject: string;
  survery_no: string;
  plot_no: string;
  order_no: string;
  order_date: string;
  issue_date: string;
  c_no_end: string;
  n_no_end: string;
  year: string;
  book_no: string;
  agreement_no: string;
  tender_agency_name: string;
  complaint_no: string;
  complaint_date: string;
}

import { errorToString } from "@/utils/methods";
import { file, File_Color } from "@prisma/client";
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
        filename: payload.applicant_name,
        updatedById: payload.created_by,
        file_no: payload.file_name,
        fts_no: payload.fts_no,
        file_ref_no: payload.file_ref_no,
        survey_no: payload.survery_no,
        plot_no: payload.plot_no,
        order_no: payload.order_no,
        order_date: new Date(payload.order_date),
        complaint_no: payload.complaint_no,
        complaint_date: new Date(payload.complaint_date),
        issue_date: new Date(payload.issue_date),
        subject: payload.file_subject,
        book_no: payload.book_no,
        file_color: payload.file_color as File_Color,
        agreement_no: payload.agreement_no,
        tender_agency_name: payload.tender_agency_name,
        n_no_end: payload.n_no_end,
        c_no_end: payload.c_no_end,
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
