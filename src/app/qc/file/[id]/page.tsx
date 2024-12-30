"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import GetfileById from "@/actions/file/getfilebyid";
import SubmitQcFile from "@/actions/qc/submitqc";
import { decryptURLData } from "@/utils/methods";
import { file, file_type, village } from "@prisma/client";
import { Button, Divider, Switch, Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { TextArea } = Input;

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

  const [remark, setRemark] = useState<string | undefined>(undefined);

  interface Problems {
    wrong_cover: boolean;
    wrong_meta: boolean;
    improper_scan: boolean;
    full_scan: boolean;
    wrong_page_count: boolean;
    corrupt_file: boolean;
  }

  const [problem, setProblem] = useState<Problems>({
    corrupt_file: false,
    full_scan: false,
    improper_scan: false,
    wrong_cover: false,
    wrong_meta: false,
    wrong_page_count: false,
  });

  const onsubmit = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (remark == null || remark == undefined || remark == "") {
      return toast.error("Enter remark");
    }

    const response = await SubmitQcFile({
      id: fileid,
      created_by: parseInt(id),
      remark: remark,
      wrong_page_count: problem.wrong_page_count,
      corrupt_file: problem.corrupt_file,
      full_rescan: problem.full_scan,
      improper_scan: problem.improper_scan,
      meta_improper: problem.wrong_meta,
      wrong_cover: problem.wrong_cover,
      wrong_file_id: false,
    });
    if (response.data && response.status) {
      toast.success(response.message);
      router.back();
    } else {
      return toast.error(response.message);
    }
  };

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
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <div className="grid grid-cols-3 w-full mt-2">
        {[
          { label: "Wrong File Cover", key: "wrong_cover" },
          { label: "Wrong Meta", key: "wrong_meta" },
          { label: "Improper Scanning", key: "improper_scan" },
          { label: "Full Scanning", key: "full_scan" },
          { label: "Wrong Page Count", key: "wrong_page_count" },
          { label: "Corrupt File", key: "corrupt_file" },
        ].map(({ label, key }) => (
          <div key={key} className="border p-2 flex gap-2 items-center">
            <p className="text-sm">{label}</p>
            <div className="grow"></div>
            <Switch
              checked={problem[key as keyof Problems]}
              onChange={(checked) =>
                setProblem((prev) => ({ ...prev, [key]: checked }))
              }
              size="small"
            />
          </div>
        ))}
      </div>
      <div className="w-full flex items-center mt-2">
        <div className="grow"></div>
        <Button type="primary" size="small" onClick={onsubmit}>
          complete
        </Button>
      </div>
    </div>
  );
};
export default QcFilePage;
