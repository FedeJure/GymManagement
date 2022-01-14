import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";

export interface IListableContext<T> {
  items: T[];
  filterByTag: string[];
  filterByContent: string[];
  setFilterByTag: (filter: string[]) => void;
  setFilterByContent: (filter: string[]) => void;
  page: number;
  setPage: (page: number) => void;
}

export interface IListableFetchPayload {
  page?: number;
  step?: number;
  filterByTag?: string[];
  filterByContent?: string[];
}

export const GetListableContext = <T,>() => {
  return React.createContext<IListableContext<T>>(DefaultListableContent);
};

export const DefaultListableContent: IListableContext<any> = {
  items: [],
  filterByContent: [],
  filterByTag: [],
  setFilterByTag: (_) => {},
  setFilterByContent: (_) => {},
  page: 0,
  setPage: (_) => {},
};

export const useListable = <T,>(
  key: string,
  fetcher: (payload: IListableFetchPayload) => Promise<T[]>
): IListableContext<T> => {
  const step = 10;
  const [filterByTag, setFilterByTag] = useState<string[]>([]);
  const [filterByContent, setFilterByContent] = useState<string[]>([]);

  const getKey = (page: number, previousPageData: T[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return [page, filterByContent, filterByTag, key];
  };
  const {
    data: items,
    error,
    size,
    setSize,
  } = useSWRInfinite<T[]>(
    getKey,
    (index) => {
      return fetcher({ page: index, step, filterByContent, filterByTag });
    },
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  const handleSetPage = (newPage: number) => {
    setSize(newPage);
  };

  return {
    items: items?.flat() || [],
    filterByTag,
    filterByContent,
    setFilterByContent,
    setFilterByTag,
    page: size,
    setPage: handleSetPage,
  };
};
