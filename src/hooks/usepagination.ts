/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

export function usePagination<T>(items: T[]) {
  const [activePage, setActivePage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<T[]>([]);
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [itemLength, setItemLength] = useState<number>(0);

  useEffect(() => {
    setItemLength((val: number) => (items == undefined ? 0 : items.length));
    const startIndex = (activePage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    if (!(items == undefined || items == null)) {
      const itemsToShow = items.slice(startIndex, endIndex);
      setPaginatedItems(itemsToShow);
    }
  }, [activePage, items, itemPerPage]);

  const totalPages = Math.ceil(itemLength / itemPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const changeActivePage = (val: number) => {
    setActivePage(val);
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  const prevPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const firstPage = () => {
    setActivePage(1);
  };

  const lastPage = () => {
    setActivePage(totalPages);
  };

  const ChangePerPage = (perpaage: number) => {
    setItemPerPage(perpaage);
    setActivePage((val) => 1);
  };

  const getMaxPage = (): number => {
    return Math.ceil(itemLength / itemPerPage);
  };

  const getTotalItemsLength = (): number => itemLength;

  return {
    paginatedItems,
    activePage,
    changeActivePage,
    totalPages,
    itemPerPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    ChangePerPage,
    getMaxPage,
    getTotalItemsLength,
  };
}
