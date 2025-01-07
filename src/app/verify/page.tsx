/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import GetVerifyCount from "@/actions/verify/getverifycount";
import GetVerifyFile from "@/actions/verify/getverifyfile";
import { encryptURLData } from "@/utils/methods";
import { file } from "@prisma/client";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// const { Search } = Input;

const VerifyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [userid, setUserid] = useState<number>(0);

  const [files, setFiles] = useState<file[]>([]);

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
    // setUserid(parseInt(id));

    const init = async () => {
      setLoading(true);

      const response = await GetVerifyCount({
        userid: parseInt(id),
      });
      if (response.data && response.status) {
        setCounts(response.data);
      }

      // userid: parseInt(id),
      const get_file_response = await GetVerifyFile();

      if (get_file_response.data && get_file_response.status) {
        setFiles(get_file_response.data);
      } else {
        toast.error(get_file_response.message);
      }
      setLoading(false);
    };

    init();
  }, []);

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
