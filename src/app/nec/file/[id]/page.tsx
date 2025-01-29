/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import GetfileById from "@/actions/file/getfilebyid";
import { decryptURLData, formateDate } from "@/utils/methods";
import { department, file, file_type, village } from "@prisma/client";
import { Button, Divider } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const QcFilePage = () => {
  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const fileid: number = parseInt(decryptURLData(idString, router));
  const [isLoading, setLoading] = useState<boolean>(true);

  const [file, setFile] = useState<
    | (file & {
        village: village | null;
        file_type: file_type | null;
        department: department | null;
      })
    | null
  >(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const file_response = await GetfileById({
        id: fileid,
      });

      if (file_response.status && file_response.data) {
        setFile(file_response.data);
      }

      setLoading(false);
    };
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="w-full md:mx-auto md:w-4/6 p-2 bg-white border rounded mt-2">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold text-left">File Details</p>
        <div className="grow"></div>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </div>
      <Divider dashed className="my-2" />
      <div className="grid grid-cols-1 lg:grid-cols-4 place-items-stretch gap-2">
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Id</p>
          <p className="text-lg">{file?.fileid}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Small Size</p>
          <p className="text-lg">{file?.small_page_count}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Mid Size</p>
          <p className="text-lg">{file?.mid_page_count}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Large Size</p>
          <p className="text-lg">{file?.large_page_count}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Department</p>
          <p className="text-lg">
            {file?.department?.name} ({file?.department?.wing})
          </p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">File Head</p>
          <p className="text-lg">{file?.file_head}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">File Type</p>
          <p className="text-lg">{file?.file_type?.name}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">File Color</p>
          <p className="text-lg">{file?.file_color}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">FTS No</p>
          <p className="text-lg">{file?.fts_no}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Year</p>
          <p className="text-lg">{file?.year}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100 col-span-2">
          <p className="text-sm">File Name</p>
          <p className="text-lg">{file?.file_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100 col-span-2">
          <p className="text-sm">Applicant Name</p>
          <p className="text-lg">{file?.filename}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100 col-span-2">
          <p className="text-sm">File Ref No</p>
          <p className="text-lg">{file?.file_ref_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100 col-span-2">
          <p className="text-sm">File Subject</p>
          <p className="text-lg">{file?.subject}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Village</p>
          <p className="text-lg">{file?.village?.name}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Survey No</p>
          <p className="text-lg">{file?.survey_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Plot No</p>
          <p className="text-lg">{file?.plot_no}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Issue Date</p>
          <p className="text-lg">
            {formateDate(file?.issue_date ?? new Date())}
          </p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100 col-span-2">
          <p className="text-sm">Order No</p>
          <p className="text-lg">{file?.order_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Order Date</p>
          <p className="text-lg">
            {formateDate(file?.order_date ?? new Date())}
          </p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100  col-span-2">
          <p className="text-sm">Book No</p>
          <p className="text-lg">{file?.book_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Agreement No</p>
          <p className="text-lg">{file?.agreement_no}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Tender Agency Name</p>
          <p className="text-lg">{file?.tender_agency_name}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Complaint No</p>
          <p className="text-lg">{file?.complaint_no}</p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">Complaint Date</p>
          <p className="text-lg">
            {formateDate(file?.complaint_date ?? new Date())}
          </p>
        </div>

        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">C No END</p>
          <p className="text-lg">{file?.c_no_end}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">N No End</p>
          <p className="text-lg">{file?.n_no_end}</p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">File Start</p>
          <p className="text-lg">
            {file?.file_start && formateDate(file?.file_start)}
          </p>
        </div>
        <div className="rounded-lg p-2 bg-gray-100">
          <p className="text-sm">File End</p>
          <p className="text-lg">
            {file?.file_end && formateDate(file?.file_end)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default QcFilePage;
