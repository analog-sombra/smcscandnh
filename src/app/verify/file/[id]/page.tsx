"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import GetProblmefileById from "@/actions/verify/getproblemfile";
import ResolveProblmeFile from "@/actions/verify/resolveproblmefile";
import { decryptURLData, formateDate } from "@/utils/methods";
import {
  department,
  file,
  file_type,
  problem_file,
  village,
} from "@prisma/client";
import { Button, Divider, Switch, Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { TextArea } = Input;

const VerifyFilePage = () => {
  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const fileid: number = parseInt(decryptURLData(idString, router));
  const [isLoading, setLoading] = useState<boolean>(true);

  const [file, setFile] = useState<
    | (file & {
        village: village | null;
        file_type: file_type | null;
        problem_file: problem_file[] | null;
        department: department | null;
      })
    | null
  >(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const file_response = await GetProblmefileById({
        id: fileid,
      });

      if (file_response.status && file_response.data) {
        setFile(file_response.data);

        const problems: problem_file[] = file_response.data.problem_file ?? [];

        if (problems.length > 0) {
          setRemark(problems[0].remarks ?? "");
          setProblem({
            corrupt_file: problems[0].corrupt_file,
            full_scan: problems[0].full_rescan,
            improper_scan: problems[0].improper_scan,
            wrong_cover: problems[0].wrong_cover,
            wrong_meta: problems[0].meta_improper,
            wrong_page_count: problems[0].wrong_page_count,
          });
        }
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

  const resolve = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (remark == null || remark == undefined || remark == "") {
      return toast.error("Enter remark");
    }

    if (
      problem.wrong_page_count == true ||
      problem.corrupt_file == true ||
      problem.full_scan == true ||
      problem.improper_scan == true ||
      problem.wrong_meta == true ||
      problem.wrong_cover == true
    ) {
      return toast.error("Solve the problem first then submit");
    }

    const response = await ResolveProblmeFile({
      id: fileid,
      created_by: parseInt(id),
      remark: remark,
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
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold text-left">Problem File</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 place-items-stretch gap-2">
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
            {file?.complaint_date ? formateDate(file?.complaint_date) : "NA"}
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

      <TextArea
        placeholder="Remarks"
        className="h-full w-full mt-3"
        style={{ resize: "none" }}
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />
      <div className="grid grid-cols-3 w-full mt-2">
        {[
          // { label: "Wrong File Cover", key: "wrong_cover" },
          // { label: "Wrong Meta", key: "wrong_meta" },
          { label: "Improper Scanning", key: "improper_scan" },
          { label: "Full Scanning", key: "full_scan" },
          // { label: "Wrong Page Count", key: "wrong_page_count" },
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
        <Button
          type="primary"
          size="small"
          onClick={resolve}
          className="bg-rose-500"
        >
          Resolve
        </Button>
      </div>
    </div>
  );
};
export default VerifyFilePage;
