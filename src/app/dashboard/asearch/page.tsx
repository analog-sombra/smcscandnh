"use client";
import ASearchFile from "@/actions/dashboard/asearch";
import getFileType from "@/actions/getfiletype";
import getVillage from "@/actions/getvillage";
import { Fa6SolidXmark, FluentMdl2Search } from "@/components/icons";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ASearch = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);

  enum SearchType {
    VILLAGE_FILENAME,
    VILLAGE_SURVAY,
    FILETYPE_VILLAGE,
    FILETYPE_FILENAME,
    // FILETEYPE_YEAR,
    // VILLAGE_YEAR,
  }
  const [isLoading, setLoading] = useState<boolean>(true);
  const [villages, setVillages] = useState<village[]>([]);
  const [fileTypes, setFileTypes] = useState<file_type[]>([]);

  const [search, setSearch] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const pagination = usePagination(searchData);

  const [searchtype, setSearchType] = useState<SearchType>(
    SearchType.VILLAGE_FILENAME
  );

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

  const file_name = useRef<HTMLInputElement>(null);
  const survey = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);

  const searchItems = async () => {
    setIsSearching(true);
    if (searchtype === SearchType.VILLAGE_FILENAME) {
      if (!village || village === 0) {
        toast.error("Village is required");
        setIsSearching(false);
        return;
      }
      if (!file_name.current?.value || file_name.current?.value === "") {
        toast.error("File title is required");
        setIsSearching(false);

        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        file_name: file_name.current?.value,
        villageId: village,
        searchtype: SearchType.VILLAGE_FILENAME,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.VILLAGE_SURVAY) {
      if (!village || village === 0) {
        toast.error("Village is required");
        setIsSearching(false);

        return;
      }

      if (!survey.current?.value || survey.current?.value === "") {
        toast.error("Survey number is required");
        setIsSearching(false);

        return;
      }
      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        survey_number: survey.current?.value,
        villageId: village,
        searchtype: SearchType.VILLAGE_SURVAY,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.FILETYPE_VILLAGE) {
      if (!village || village === 0) {
        toast.error("Village is required");
        setIsSearching(false);

        return;
      }
      if (!fileType || fileType === 0) {
        toast.error("File Type is required");
        setIsSearching(false);

        return;
      }
      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        typeId: fileType,
        villageId: village,
        searchtype: SearchType.FILETYPE_VILLAGE,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    } else if (searchtype === SearchType.FILETYPE_FILENAME) {
      if (!file_name.current?.value || file_name.current?.value === "") {
        toast.error("File title is required");
        setIsSearching(false);

        return;
      }
      if (!fileType || fileType === 0) {
        toast.error("File Type is required");
        setIsSearching(false);

        return;
      }

      const filesearch: ApiResponseType<file[] | null> = await ASearchFile({
        file_name: file_name.current?.value,
        typeId: fileType,
        searchtype: SearchType.FILETYPE_FILENAME,
      });

      if (filesearch.status) {
        setSearchData(filesearch.data!);
        setSearch(true);
        toast.success("File search completed");
      } else {
        toast.error(filesearch.message);
      }
    }
    setIsSearching(false);
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
              property.filename
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
              property.year
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
    <div className="min-h-screen p-6 mx-auto bg-white">
      {!search && (
        <div className=" h-full p-2 w-4/6 mx-auto  px-10">
          <h1 className="text-center text-2xl font-medium">
            Search File Details
          </h1>
          <div className="flex gap-2 items-center mt-4">
            <label htmlFor="fileid" className="w-44 text-right">
              Select Criteria:
            </label>
            <div className="w-full">
              <Select
                onValueChange={(val) => {
                  if (val == SearchType.VILLAGE_FILENAME.toString()) {
                    setSearchType(SearchType.VILLAGE_FILENAME);
                  }
                  if (val == SearchType.VILLAGE_SURVAY.toString()) {
                    setSearchType(SearchType.VILLAGE_SURVAY);
                  }
                  if (val == SearchType.FILETYPE_VILLAGE.toString()) {
                    setSearchType(SearchType.FILETYPE_VILLAGE);
                  }
                  if (val == SearchType.FILETYPE_FILENAME.toString()) {
                    setSearchType(SearchType.FILETYPE_FILENAME);
                  }
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="File Type/Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Search Type</SelectLabel>

                    <SelectItem value={SearchType.VILLAGE_FILENAME.toString()}>
                      Village/File Title
                    </SelectItem>
                    <SelectItem value={SearchType.VILLAGE_SURVAY.toString()}>
                      Village/Survey
                    </SelectItem>
                    <SelectItem value={SearchType.FILETYPE_VILLAGE.toString()}>
                      File Type/Village
                    </SelectItem>
                    <SelectItem value={SearchType.FILETYPE_FILENAME.toString()}>
                      File Type/File Title
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {searchtype === SearchType.FILETYPE_VILLAGE ||
          searchtype == SearchType.FILETYPE_FILENAME ? (
            <div className="flex gap-2 items-center mt-4">
              <label htmlFor="fileid" className="w-44 text-right">
                File Type :
              </label>
              <Select
                onValueChange={(val) => {
                  setFileType(parseInt(val));
                }}
              >
                <SelectTrigger className="">
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
          ) : (
            <></>
          )}

          {searchtype === SearchType.VILLAGE_SURVAY ||
          searchtype == SearchType.VILLAGE_FILENAME ||
          searchtype == SearchType.FILETYPE_VILLAGE ? (
            <div className="flex gap-2 items-center mt-4">
              <label htmlFor="fileid" className="w-44 text-right">
                Village :
              </label>
              <Select
                onValueChange={(val) => {
                  setVillage(parseInt(val));
                }}
              >
                <SelectTrigger className="">
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
          ) : (
            <></>
          )}
          {searchtype === SearchType.VILLAGE_SURVAY && (
            <div className="flex gap-2 items-center  mt-4">
              <label htmlFor="survey" className="w-44 text-right">
                Survey Number :
              </label>
              <Input
                placeholder="survey"
                id="survey"
                name="survey"
                ref={survey}
              />
            </div>
          )}

          {searchtype === SearchType.VILLAGE_FILENAME ||
          searchtype === SearchType.FILETYPE_FILENAME ? (
            <div className="flex gap-2 items-center  mt-4">
              <label htmlFor="name" className="w-44 text-right">
                File Title :
              </label>
              <Input
                placeholder="Enter File title"
                id="file_name"
                name="file_name"
                ref={file_name}
              />
            </div>
          ) : (
            <></>
          )}

          <div className="flex">
            <div className="grow"></div>

            {isSearching ? (
              <Button
                className="mt-4 bg-[#172e57] hover:bg-[#21437d]  w-40"
                onClick={searchItems}
              >
                Searching...
              </Button>
            ) : (
              <Button
                className="mt-4 bg-[#172e57] hover:bg-[#21437d]  w-40"
                onClick={searchItems}
              >
                Search
              </Button>
            )}
          </div>
        </div>
      )}

      {search && (
        <div className="mt-2">
          <CardHeader className="py-2 px-4 flex flex-row items-center gap-2">
            <h1 className="text-xl">Search Result</h1>
            <div className="grow"></div>

            <div className="flex gap-2 items-center bg-gray-100 rounded-md pl-2">
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
            <button
              onClick={() => setSearch(false)}
              className="text-white bg-rose-500 rounded h-8 px-2"
            >
              Clear Search
            </button>
          </CardHeader>
          {isSearch ? (
            paginationsearch.paginatedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-sm font-normal p-2 px-4">
                        File Id
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        Name
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        Survey Number
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        Year
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        File Type
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        Village
                      </TableHead>
                      <TableHead className="text-sm font-normal p-2">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginationsearch.paginatedItems.map((val: any) => (
                      <TableRow key={val.id}>
                        <TableCell className="text-xs p-2 px-4">
                          {val.file_id}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {val.applicant_name}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {val.survey_number}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {val.year}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {val.type.name}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {val.village.name}
                        </TableCell>
                        <TableCell className="p-2">
                          <Link
                            target="_blank"
                            className="bg-[#172e57] text-xs text-white  py-1 px-2 rounded-md hover:bg-[#1a3561] transition-all duration-200 ease-in-out inline-block"
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
                    <TableHead className="w-[100px] text-sm font-normal p-2 px-4">
                      File Id
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Name
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Survey Number
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Year
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      File Type
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Village
                    </TableHead>
                    <TableHead className="text-sm font-normal p-2">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.map((val: any) => (
                    <TableRow key={val.id}>
                      <TableCell className="text-xs p-2 px-4">
                        {val.file_id}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.applicant_name}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.survey_number}
                      </TableCell>
                      <TableCell className="text-xs p-2">{val.year}</TableCell>
                      <TableCell className="text-xs p-2">
                        {val.type.name}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {val.village.name}
                      </TableCell>
                      <TableCell className="p-2">
                        <Link
                          target="_blank"
                          className="bg-[#172e57] text-xs text-white  py-1 px-2 rounded-md hover:bg-[#1a3561] transition-all duration-200 ease-in-out inline-block"
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
        </div>
      )}
    </div>
  );
};
export default ASearch;
