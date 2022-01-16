import { useEffect, useState } from "react";
import { CardGroup, Divider, Pagination } from "semantic-ui-react";
import { EntityConfigResponse } from "../../domain/EntityConfig";

interface IPaginatedGridPage {
  fetchCountOfItems: () => Promise<EntityConfigResponse>;
  step: number
  onPageChange: (page: number) => void
  elements: JSX.Element[]
}

export const PaginatedGridPage: React.FC<IPaginatedGridPage> = ({
  fetchCountOfItems,
  step,
  onPageChange,
  elements
}) => {
  const [maxPages, setMaxPages] = useState(0);
  useEffect(() => {
    fetchCountOfItems().then((config) => {
      setMaxPages(Math.ceil(config.totalCount / step));
    });
  }, [elements]);

  return (
    <div>
      <div style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
        {elements.length > 0 && (
          <CardGroup centered>{elements}</CardGroup>
        )}
        <Divider />
      </div>

      <div
        style={{
          width: "90%",
          justifyContent: "center",
          position: "fixed",
          bottom: "3%",
        }}
      >
        {maxPages > 1 && (
          <Pagination
            totalPages={maxPages}
            onPageChange={(_, d) => onPageChange(Number(d.activePage))}
          />
        )}
      </div>
    </div>
  );
};
