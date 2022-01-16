import React, { useMemo, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export interface IListableContext<T> {
  items: T[];
  filterByTag: string[];
  filterByContent: string[];
  setFilterByTag: (filter: string[]) => void;
  setFilterByContent: (filter: string[]) => void;
  page: number;
  setPage: (page: number) => void;
  updateOne: (id: string, payload: Partial<T>) => void;
  step: number
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
  setFilterByTag: () => {},
  setFilterByContent: () => {},
  page: 0,
  setPage: () => {},
  updateOne: () => {},
  step: 0
};

export const useListable = <T extends { id: string }>(
  key: string,
  fetcher: (payload: IListableFetchPayload) => Promise<T[]>
): IListableContext<T> => {
  const step = 20;
  const [filterByTag, setFilterByTag] = useState<string[]>([]);
  const [filterByContent, setFilterByContent] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const {
    data: items,
    error,
    mutate,
  } = useSWR<T[]>(
    [page, filterByContent, filterByTag, key],
    () => fetcher({ page, step, filterByContent, filterByTag }),
    { revalidateOnFocus: false }
  );

  const updateOne = (id: string, payload: Partial<T>) => {
    mutate(async (draft) => {
      if (draft === undefined) return;
      for (let j = 0; j < draft.length; j++) {
        const item = draft[j];
        if (item.id === id) {
          draft[j] = { ...item, ...payload };
          return [...draft];
        }
      }
    }, true);
  };

  const handleSetPage = (newPage: number) => {
    setPage(newPage - 1);
  };

  const flatItems = useMemo(() => {
    return items ? new Array<T>().concat(...items) : [];
  }, [items]);

  return {
    items: flatItems,
    filterByTag,
    filterByContent,
    setFilterByContent,
    setFilterByTag,
    page,
    setPage: handleSetPage,
    updateOne,
    step
  };
};
