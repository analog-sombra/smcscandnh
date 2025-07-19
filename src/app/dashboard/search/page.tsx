"use client";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import fileSearch from "@/actions/searchfile";
import { Fa6SolidXmark, FluentMdl2Search } from "@/components/icons";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usepagination";
import { ApiResponseType } from "@/models/response";
import { handleNumberChange } from "@/utils/methods";
import { file, file_type, user, village } from "@prisma/client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Search = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [search, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const pagination = usePagination(searchData);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const villages_response = await getVillage({});
      if (villages_response.status) {
        setVillages(villages_response.data!);
      }

      const file_type_response = await getFileType({});
      if (file_type_response.status) {
        setFileTypes(file_type_response.data!);
      }
      setLoading(false);
    };
    init();
  }, []);

  const [fileType, setFileType] = useState<number>(0);
  const [village, setVillage] = useState<number>(0);

  const file_id = useRef<HTMLInputElement>(null);
  const file_title = useRef<HTMLInputElement>(null);
  const old_file_no = useRef<HTMLInputElement>(null);
  const subject = useRef<HTMLInputElement>(null);
  const fts_no = useRef<HTMLInputElement>(null);
  const file_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const plot = useRef<HTMLInputElement>(null);

  // const file_no = useRef<HTMLInputElement>(null);
  // const year = useRef<HTMLInputElement>(null);
  // const fileref = useRef<HTMLInputElement>(null);
  // const remark = useRef<HTMLTextAreaElement>(null);
  // const villageRef = useRef<HTMLSelectElement>(null);
  // const typeRef = useRef<HTMLSelectElement>(null);

  const searchItems = async () => {
    setIsSearching(true);
    if (
      fileType === 0 &&
      village === 0 &&
      !file_id.current?.value &&
      !file_title.current?.value &&
      !file_name.current?.value &&
      !survey.current?.value &&
      !plot.current?.value &&
      !fts_no.current?.value &&
      !old_file_no.current?.value &&
      !subject.current?.value
    ) {
      toast.error("Please enter any search criteria");
      setIsSearching(false);
      return;
    }

    const filesearch: ApiResponseType<file[] | null> = await fileSearch({
      // file_no:
      //   file_no.current?.value == "" ? undefined : file_no.current?.value,
      // file_id:
      //   file_id.current?.value == "" ? undefined : file_id.current?.value,
      // applicant_name:
      //   applicant_name.current?.value == ""
      //     ? undefined
      //     : applicant_name.current?.value,
      // survey_number:
      //   survey.current?.value == "" ? undefined : survey.current?.value,
      // year: year.current?.value == "" ? undefined : year.current?.value,
      // typeId: fileType == 0 ? undefined : fileType,
      // villageId: village == 0 ? undefined : village,
      // file_ref:
      //   fileref.current?.value == "" ? undefined : fileref.current?.value,
      typeId: fileType == 0 ? undefined : fileType,
      villageId: village == 0 ? undefined : village,
      file_id:
        file_id.current?.value == "" ? undefined : file_id.current?.value,
      file_title:
        file_title.current?.value == "" ? undefined : file_title.current?.value,
      old_file_no:
        old_file_no.current?.value == ""
          ? undefined
          : old_file_no.current?.value,
      fts_no: fts_no.current?.value == "" ? undefined : fts_no.current?.value,
      subject:
        subject.current?.value == "" ? undefined : subject.current?.value,
      file_name:
        file_name.current?.value == "" ? undefined : file_name.current?.value,
      survey: survey.current?.value == "" ? undefined : survey.current?.value,
      plot: plot.current?.value == "" ? undefined : plot.current?.value,
    });

    console.log(filesearch);
    if (filesearch.status) {
      setSearchData(filesearch.data!);
      setSearch(true);
      toast.success("File search completed");
    } else {
      toast.error(filesearch.message);
    }
    setIsSearching(false);
  };

  const clearSearch = async () => {
    window.location.reload();
  };

  // ---------------search section----------------

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const paginationsearch = usePagination(searchresult);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          searchData.filter(
            (property) =>
              property.fileid
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.file_no
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.filename
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.old_file_no
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.subject
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.fts_no
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.plot_no
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.survey_no
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.file_type.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.village.name
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                )
          )
        );
      } else {
        setIsSearch(false);
      }
    }
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-4 mx-auto">
      <Card className=" h-full p-2 px-6">
        <h1 className="text-center text-2xl font-medium">
          Search File Details
        </h1>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="file_id" className="w-60">
            File Id :
          </label>
          <Input
            placeholder="Enter New File ID"
            id="file_id"
            name="file_id"
            ref={file_id}
            className="placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileid" className="w-60">
            File Type :
          </label>
          <Select
            onValueChange={(val) => {
              setFileType(parseInt(val));
            }}
          >
            <SelectTrigger className="data-[placeholder]:text-gray-300">
              <SelectValue placeholder="Select File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>File Type</SelectLabel>
                {fileTypes.map((val) => (
                  <SelectItem key={val.id} value={val.id.toString()}>
                    {val.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="year" className="w-60">
            File Title :
          </label>
          <Input
            onChange={handleNumberChange}
            placeholder="File Title"
            id="file_title"
            name="file_title"
            ref={file_title}
            className="placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileref" className="w-60">
            File Name :
          </label>
          <Input
            placeholder="File Name"
            id="file_name"
            name="file_name"
            ref={file_name}
            className="placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="file_no" className="w-60">
            Old File No :
          </label>
          <Input
            placeholder="Enter Old File No"
            id="file_no"
            name="file_no"
            ref={old_file_no}
            className="placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="subject" className="w-60">
            Subject :
          </label>
          <Input
            placeholder="Enter Subject"
            id="subject"
            name="subject"
            ref={subject}
            className="placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="file_no" className="w-60">
            FTS No :
          </label>
          <Input
            placeholder="Enter FTS No"
            id="fts_no"
            name="fts_no"
            ref={fts_no}
            className="placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2 items-center mt-4">
          <label htmlFor="fileid" className="w-60">
            Village :
          </label>
          <Select
            onValueChange={(val) => {
              setVillage(parseInt(val));
            }}
          >
            <SelectTrigger className="data-[placeholder]:text-gray-300">
              <SelectValue placeholder="Select Village" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Village</SelectLabel>
                {villages.map((val) => (
                  <SelectItem key={val.id} value={val.id.toString()}>
                    {val.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="survey" className="w-60">
            Survey Number :
          </label>
          <Input
            placeholder="Survey Number"
            className="placeholder:text-gray-300"
            id="survey"
            name="survey"
            ref={survey}
          />
        </div>
        <div className="flex gap-2 items-center  mt-4">
          <label htmlFor="name" className="w-60">
            Plot :
          </label>
          <Input
            placeholder="Enter Plot"
            id="plot"
            name="plot"
            ref={plot}
            className="placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-4">
          <div className="grow"></div>
          <Button
            className="w-40 mt-4 bg-red-500 hover:bg-red-600"
            onClick={clearSearch}
          >
            Clear Search
          </Button>
          {isSearching ? (
            <Button
              className="w-40 mt-4 bg-[#172e57] hover:bg-[#21437d]"
              disabled
            >
              Searching...
            </Button>
          ) : (
            <Button
              className="w-40 mt-4 bg-[#172e57] hover:bg-[#21437d]"
              onClick={searchItems}
            >
              Search
            </Button>
          )}
        </div>
      </Card>
      <Card className="mt-6">
        <CardHeader className="py-2 px-4 flex flex-row items-center">
          <h1 className="text-xl">Search Result</h1>
          <div className="grow"></div>

          <div className="flex items-center bg-gray-100 rounded-md pl-2">
            <FluentMdl2Search />
            <input
              ref={searchRef}
              type="text"
              onChange={searchchange}
              className="bg-transparent outline-none focus:outline-none py-1 px-4"
              placeholder="Enter Search Text.."
            />
            {isSearch && (
              <button onClick={clearsearch} className=" p-2 text-black">
                <Fa6SolidXmark></Fa6SolidXmark>
              </button>
            )}
          </div>
        </CardHeader>
        {isSearch ? (
          paginationsearch.paginatedItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">File Id</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Survey Number</TableHead>
                    <TableHead>File Title</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginationsearch.paginatedItems.map((val: any) => (
                    <TableRow key={val.id}>
                      <TableCell className="font-medium">
                        {val.fileid}
                      </TableCell>
                      <TableCell>{val.filename}</TableCell>
                      <TableCell>{val.survey_no ?? "NA"}</TableCell>
                      <TableCell>{val.file_no}</TableCell>
                      <TableCell>{val.file_type.name}</TableCell>
                      <TableCell>{val.village.name}</TableCell>
                      <TableCell>
                        <Link
                          target="_blank"
                          className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                          href={`/dashboard/viewfile/${val.id}`}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p>No data found</p>
            </div>
          )
        ) : search && searchData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">File Id</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Survey Number</TableHead>
                  <TableHead>File Title</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.map((val: any) => (
                  <TableRow key={val.id}>
                    <TableCell className="font-medium">{val.fileid}</TableCell>
                    <TableCell>{val.filename}</TableCell>
                    <TableCell>{val.survey_no ?? "NA"}</TableCell>
                    <TableCell>{val.file_no}</TableCell>
                    <TableCell>{val.file_type.name}</TableCell>
                    <TableCell>{val.village.name}</TableCell>
                    <TableCell>
                      <Link
                        target="_blank"
                        className="py-1 px-4 bg-[#172f57] text-white text-lg rounded-md"
                        href={`/dashboard/viewfile/${val.id}`}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p>No data found</p>
          </div>
        )}

        {isSearch
          ? paginationsearch.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={paginationsearch.ChangePerPage}
                  activePage={paginationsearch.activePage}
                  changeActivePage={paginationsearch.changeActivePage}
                  firstPage={paginationsearch.firstPage}
                  getMaxPage={paginationsearch.getMaxPage}
                  getTotalItemsLength={paginationsearch.getTotalItemsLength}
                  goToPage={paginationsearch.goToPage}
                  itemPerPage={paginationsearch.itemPerPage}
                  lastPage={paginationsearch.lastPage}
                  nextPage={paginationsearch.nextPage}
                  paginatedItems={paginationsearch.paginatedItems}
                  prevPage={paginationsearch.prevPage}
                  totalPages={paginationsearch.totalPages}
                ></Pagination>
              </div>
            )
          : pagination.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={pagination.ChangePerPage}
                  activePage={pagination.activePage}
                  changeActivePage={pagination.changeActivePage}
                  firstPage={pagination.firstPage}
                  getMaxPage={pagination.getMaxPage}
                  getTotalItemsLength={pagination.getTotalItemsLength}
                  goToPage={pagination.goToPage}
                  itemPerPage={pagination.itemPerPage}
                  lastPage={pagination.lastPage}
                  nextPage={pagination.nextPage}
                  paginatedItems={pagination.paginatedItems}
                  prevPage={pagination.prevPage}
                  totalPages={pagination.totalPages}
                ></Pagination>
              </div>
            )}
      </Card>
    </div>
  );
};
export default Search;
