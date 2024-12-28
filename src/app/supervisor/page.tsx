"use client";
import CollectFile from "@/actions/supervisor/collectfile";
import { handleNumberChange } from "@/utils/methods";
import { Button, InputRef, Popover } from "antd";
import { Input } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const { Search } = Input;

const QcPage = () => {
  const router = useRouter();

  const countRef = useRef<InputRef>(null);

  const collectfile = async () => {
    const id = getCookie("id");

    if (id == null) {
      toast.error("User not found");
      return router.push("/login");
    }

    if (
      countRef.current == null ||
      countRef.current.input == null ||
      countRef.current.input.value == ""
    ) {
      return toast.error("Please enter count");
    }

    if (isNaN(parseInt(countRef.current.input.value))) {
      return toast.error("Please enter valid count");
    }

    const count = parseInt(countRef.current.input.value);

    const collect_file_response = await CollectFile({
      count,
      created_by: parseInt(id),
    });

    if (collect_file_response.data && collect_file_response.status) {
      toast.success(collect_file_response.message);
    } else {
      toast.error(collect_file_response.message);
    }
    setPopOpen(false);
  };

  const [popOpen, setPopOpen] = useState(false);

  return (
    <>
      <div className="w-full md:mx-auto md:w-4/6 grid grid-cols-3 gap-2 items-center mt-2">
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays File Count</p>
          <p className="text-left text-xl">234</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Todays Page Count</p>
          <p className="text-left text-xl">234</p>
        </div>
        <div className="bg-white border  rounded p-2">
          <p className="text-left text-sm">Pending File Count</p>
          <p className="text-left text-xl">234</p>
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-4/6 mt-2 flex items-center gap-2">
        <p className="text-lg md:text-2xl">Your Running Files (23)</p>
        <div className="grow"></div>
        <Popover
          open={popOpen}
          trigger="click"
          content={
            <div className="flex flex-col gap-1">
              <Input
                ref={countRef}
                placeholder="Enter Count"
                className="w-full"
                onChange={handleNumberChange}
              />
              <Button type="primary" size="small" onClick={collectfile}>
                Request
              </Button>
            </div>
          }
          title="Collect File From Department"
        >
          <Button type="primary" onClick={() => setPopOpen(true)}>
            Collect File
          </Button>
        </Popover>
        <Search
          className="w-40"
          placeholder="input search text"
          loading={false}
        />
      </div>
    </>
  );
};

export default QcPage;
