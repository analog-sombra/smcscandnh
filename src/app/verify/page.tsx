/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import GetVerifyCount from "@/actions/verify/getverifycount";
import GetVerifyFile from "@/actions/verify/getverifyfile";
import VerifyRequestFile from "@/actions/verify/verifyreqfile";
import { encryptURLData } from "@/utils/methods";
import { file_base } from "@prisma/client";
import { Button, Input, Popover } from "antd";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

// const { Search } = Input;

const VerifyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [userid, setUserid] = useState<number>(0);

  const [files, setFiles] = useState<file_base[]>([]);

  const [popOpen, setPopOpen] = useState(false);
  const [count, setCount] = useState<number | undefined>(undefined);
  const [userid, setUserid] = useState<number>(0);

  const init = async () => {
    setLoading(true);

    const response = await GetVerifyCount({
      userid: userid,
    });
    if (response.data && response.status) {
      setCounts(response.data);
    }

    // userid: parseInt(id),
    const get_file_response = await GetVerifyFile({
      userid: userid,
    });

    if (get_file_response.data && get_file_response.status) {
      setFiles(get_file_response.data);
    } else {
      toast.error(get_file_response.message);
    }
    setLoading(false);
  };

  const requestfile = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (count == 0 || count == null || count == undefined) {
      return toast.error("Please enter count");
    }

    if (count >= 26) {
      return toast.error("Count should be less than 25.");
    }

    const request_file_response = await VerifyRequestFile({
      count,
      created_by: parseInt(id),
    });

    if (request_file_response.data && request_file_response.status) {
      toast.success(request_file_response.message);
    } else {
      toast.error(request_file_response.message);
    }
    await init();
    setPopOpen(false);
  };

  interface ResponseType {
    filecount: number;
    pagecount: number;
  }

  const [counts, setCounts] = useState<ResponseType>({
    filecount: 0,
    pagecount: 0,
  });

  useEffect(() => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }
    setUserid(parseInt(id));

    const init = async () => {
      setLoading(true);

      const response = await GetVerifyCount({
        userid: parseInt(id),
      });
      if (response.data && response.status) {
        setCounts(response.data);
      }

      // userid: parseInt(id),
      const get_file_response = await GetVerifyFile({
        userid: parseInt(id),
      });

      if (get_file_response.data && get_file_response.status) {
        setFiles(get_file_response.data);
      } else {
        toast.error(get_file_response.message);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setCount: Dispatch<SetStateAction<number | undefined>>
  ) => {
    const onlyNumbersRegex = /^[0-9]*$/;
    const { value } = event.target;

    if (onlyNumbersRegex.test(value)) {
      // Parse value and handle empty case
      const adddata = value === "" ? undefined : parseInt(value, 10);
      setCount(adddata);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-screen w-full font-semibold text-3xl">
        Loading..
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays File Count</p>
          <p className="text-left text-xl">{counts.filecount}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays Page Count</p>
          <p className="text-left text-xl">{counts.pagecount}</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Pending File Count</p>
          <p className="text-left text-xl">{files.length}</p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6 mt-2 flex items-center gap-2">
        <p className="text-lg md:text-2xl">Your Running Files</p>
        <div className="grow"></div>
        <Popover
          open={popOpen}
          trigger="click"
          content={
            <div className="flex flex-col gap-1">
              <Input
                value={count === undefined ? "" : count.toString()} // Controlled input
                onChange={(e) => handleNumberChange(e, setCount)}
                placeholder="Enter Count"
                className="w-full"
              />
              <Button type="primary" size="small" onClick={requestfile}>
                Request
              </Button>
            </div>
          }
          title="Request File"
        >
          <Button type="primary" onClick={() => setPopOpen(true)}>
            Request File
          </Button>
        </Popover>
      </div>
      <div className="w-full md:mx-auto md:w-4/6 mt-2 grid grid-cols-8 items-center  gap-2">
        {files.map((file, index: number) => (
          <Link
            href={`/verify/file/${encryptURLData(file.id.toString())}`}
            key={index}
          >
            <p className="bg-white p-1 px-3 rounded border">{file.fileid}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default VerifyPage;
