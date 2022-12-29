import { useEffect, useState } from "react";
import {Wrap, WrapItem, Center, WrapProps} from "@chakra-ui/react"
import useSWR from "swr";
import { EntityConfigResponse } from "../../domain/EntityConfig";

interface IPaginatedGridPage {
  fetchCountOfItems: () => Promise<EntityConfigResponse>;
  step: number
  onPageChange: (page: number) => void
  elements: JSX.Element[]
}

export const PaginatedGridPage: React.FC<IPaginatedGridPage & WrapProps> = ({
  fetchCountOfItems,
  step,
  onPageChange,
  elements,
  ...props
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
          {...props}
        >
          {elements.length > 0 &&
            elements.map((element, i) => <WrapItem key={`element-${i}`}>{element}</WrapItem>)}
        </Wrap>
      </>
    );
};
