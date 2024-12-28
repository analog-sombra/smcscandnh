"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import GetfileById from "@/actions/file/getfilebyid";
import { decryptURLData } from "@/utils/methods";
import { file, file_type, village } from "@prisma/client";
import { Button, Divider, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const QcFilePage = () => {
  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const fileid: number = parseInt(decryptURLData(idString, router));
  const [isLoading, setLoading] = useState<boolean>(true);

  const [file, setFile] = useState<
    (file & { village: village | null; file_type: file_type | null }) | null
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
      <p className="text-2xl font-semibold text-left">Problem File</p>
      <Divider dashed className="my-2" />
      <div className="flex mt-3">
        <p className="w-60">File Id:</p>
        <p className="grow">{file?.fileid}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Small Size 1:</p>
        <p className="grow">{file?.small_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Med Size 2:</p>
        <p className="grow">{file?.mid_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Large Size 3:</p>
        <p className="grow">{file?.large_page_count}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">File Type:</p>
        <p className="grow">{file?.file_type?.name}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Year:</p>
        <p className="grow">{file?.year}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Applicant Name:</p>
        <p className="grow">{file?.filename}</p>
      </div>
      <div className="flex mt-3">
        <p className="w-60">Village:</p>
        <p className="grow">{file?.village?.name}</p>
      </div>

      <TextArea
        placeholder="Remarks"
        className="h-full w-full mt-3"
        style={{ resize: "none" }}
      />
      <div className="grid grid-cols-3 w-full mt-2">
        <div className="border p-2 flex gap-2 items-center">
          <p className="text-sm">Wrong File Cover</p>
          <div className="grow"></div>
          <Switch defaultChecked size="small" />
        </div>
        <div className="border p-2 flex gap-2 items-center">
          <p className="text-sm">Wrong Meta</p>
          <div className="grow"></div>

          <Switch defaultChecked size="small" />
        </div>
        <div className="border p-2 flex gap-1 items-center">
          <p className="text-sm">Improper Scanning</p>
          <div className="grow"></div>
          <Switch defaultChecked size="small" />
        </div>
        <div className="border p-2 flex gap-1 items-center">
          <p className="text-sm">Full Scanning</p>
          <div className="grow"></div>
          <Switch defaultChecked size="small" />
        </div>
        <div className="border p-2 flex gap-1 items-center">
          <p className="text-sm">Wrong Page Count</p>
          <div className="grow"></div>
          <Switch defaultChecked size="small" />
        </div>
        <div className="border p-2 flex gap-1 items-center">
          <p className="text-sm">Corrupt File</p>
          <div className="grow"></div>
          <Switch defaultChecked size="small" />
        </div>
      </div>
      <div className="w-full flex items-center mt-2">
        <div className="grow"></div>
        <Button type="primary" size="small">
          complete
        </Button>
      </div>
    </div>
  );
};
export default QcFilePage;
