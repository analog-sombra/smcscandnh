/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSX, KeyboardEvent } from "react";
import { useState } from "react";
import {
  CarbonChevronDown,
  CharmChevronLeft,
  CharmChevronRight,
  MaterialSymbolsKeyboardDoubleArrowLeft,
  MaterialSymbolsKeyboardDoubleArrowRight,
} from "./icons";

interface PaginationProps {
  paginatedItems: any[];
  activePage: number;
  changeActivePage: (val: number) => void;
  totalPages: number;
  itemPerPage: number;
  goToPage: (val: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  ChangePerPage: (val: number) => void;
  getMaxPage: () => number;
  getTotalItemsLength: () => number;
}

const Pagination: React.FC<PaginationProps> = (
  props: PaginationProps
): JSX.Element => {
  const [isSelectPage, setSelectPage] = useState<boolean>(false);

  const handelPageChange = () => {
    setSelectPage((val) => !val);
  };

  const handelGoTo = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const page: number = parseInt(
        (event.target as HTMLInputElement).value.replace(/\D/g, "")
      );
      if (page <= props.getMaxPage()) {
        props.changeActivePage(page);
      }
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 2;

    for (
      let i = Math.max(1, props.activePage - maxButtonsToShow);
      i <= Math.min(props.getMaxPage(), props.activePage + maxButtonsToShow);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() => props.changeActivePage(i)}
          className={`rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center ${
            props.activePage === i
              ? "bg-blue-500 bg-opacity-25 text-blue-500 border-blue-500"
              : ""
          }`}
        >
          {i}
        </button>
      );
    }

    if (props.activePage - maxButtonsToShow > 1) {
      buttons.unshift(
        <button
          key="left-ellipsis"
          disabled
          className="rounded text-sm text-center min-w-7 h-7 px-1 grid place-items-center cursor-not-allowed"
        >
          ...
        </button>
      );
    }

    if (props.activePage + maxButtonsToShow < props.getMaxPage()) {
      buttons.push(
        <button
          key="right-ellipsis"
          disabled
          className="rounded text-sm text-center min-w-7 h-7 px-1 grid place-items-center cursor-not-allowed"
        >
          ...
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <div className="flex items-center gap-2 w-full mt-4 flex-wrap justify-between gap-y-4">
        <div className="flex gap-2 items-center">
          <p className="text-sm text-black font-normal text-left">
            Page {props.activePage}/{props.getMaxPage()}
          </p>
          <div className="h-5 w-[1px] bg-gray-500"></div>
          <p className="text-sm text-black font-normal text-left">
            Total {props.getTotalItemsLength()} item
          </p>
        </div>

        <div className="flex gap-1 items-center">
          <button
            onClick={props.firstPage}
            className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
          >
            <MaterialSymbolsKeyboardDoubleArrowLeft></MaterialSymbolsKeyboardDoubleArrowLeft>
          </button>
          <button
            onClick={props.prevPage}
            className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
          >
            <CharmChevronLeft></CharmChevronLeft>
          </button>
          {renderPageButtons()}
          <button
            onClick={props.nextPage}
            className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
          >
            <CharmChevronRight></CharmChevronRight>
          </button>
          <button
            onClick={props.lastPage}
            className="rounded border border-gray-500 hover:border-blue-500 hover:text-blue-500 text-sm text-center min-w-7 h-7 px-1 grid place-items-center"
          >
            <MaterialSymbolsKeyboardDoubleArrowRight></MaterialSymbolsKeyboardDoubleArrowRight>
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <div
              onClick={handelPageChange}
              className="px-2 h-7 text-sm text-black font-normal text-center rounded-md border border-gray-500 hover hover:border-blue-500 flex gap-1 items-center w-32 cursor-pointer"
            >
              <p>{props.itemPerPage} / Page</p>
              <div className="grow"></div>
              <CarbonChevronDown></CarbonChevronDown>
            </div>
            <div
              className={`absolute bottom-0 -translate-y-10 bg-white  left-0 rounded-md shadow-sm w-32 overflow-y-hidden transition-all duration-500 ${
                isSelectPage ? "block" : "hidden"
              }`}
            >
              {[5, 10, 25, 50, 100, 250].map((val: number, index: number) => (
                <p
                  key={index}
                  onClick={() => {
                    handelPageChange();
                    props.ChangePerPage(val);
                  }}
                  className="rounded-md hover:bg-blue-500 hover:bg-opacity-25 cursor-pointer px-2 mx-2 my-1 text-sm"
                >
                  {val} / Page
                </p>
              ))}
            </div>
          </div>
          <div className="h-5 w-[1px] bg-gray-500"></div>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-black font-normal text-left">go to</p>
            <input
              onKeyDown={handelGoTo}
              type="text"
              pattern="[0-9]*"
              onChange={(event) => {
                event.target.value = event.target.value.replace(/\D/g, "");
              }}
              className="text-black border border-gray-400 focus:border-blue-500 px-2 rounded-md w-14 outline-none"
            />
            <p className="text-sm text-black font-normal text-left">page</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Pagination;
