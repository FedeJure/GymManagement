import { useEffect, useState } from "react";
import {Wrap, WrapItem, Center} from "@chakra-ui/react"
import useSWR from "swr";
import { EntityConfigResponse } from "../../domain/EntityConfig";

interface IPaginatedGridPage {
  fetchCountOfItems: () => Promise<EntityConfigResponse>;
  step: number
  onPageChange: (page: number) => void
  elements: JSX.Element[]
  maxHeight?: string 
}

export const PaginatedGridPage: React.FC<IPaginatedGridPage> = ({
  fetchCountOfItems,
  step,
  onPageChange,
  elements,
  maxHeight
}) => {
  const [maxPages, setMaxPages] = useState(0);
  useEffect(() => {
    fetchCountOfItems().then((config) => {
      setMaxPages(Math.ceil(config.totalCount / step));
    });
  }, [elements]);
    return (
      <>
        <Wrap
          m="5"
          spacing="30px"
          align="center"
          placeContent={"center"}
          justify={"center"}
        >
          {elements.length > 0 &&
            elements.map((element) => <WrapItem>{element}</WrapItem>)}
        </Wrap>
        {/* <Center>
          {maxPages > 1 && (
            <Pagination
              totalPages={maxPages}
              onPageChange={(_, d) => onPageChange(Number(d.activePage))}
            />
          )}
        </Center> */}
      </>
    );
};
