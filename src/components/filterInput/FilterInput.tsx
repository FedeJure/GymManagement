import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Box, BoxProps, Text } from "@chakra-ui/react";

type FilterOption = {
  value: string;
  label: string;
  isFixed?: boolean;
};

export const FilterInput = ({
  onTagFilterChange,
  onCustomFilterChange,
  tagOptions,
  defaultTagFilters = [],
  ...props
}: {
  onTagFilterChange: Function;
  onCustomFilterChange: Function;
  tagOptions: FilterOption[];
  defaultTagFilters?: string[];
} & BoxProps) => {
  const [selections, setSelections] = useState<string[]>([]);
  const [options, setOptions] = useState<FilterOption[]>(tagOptions);

  const handleChange = (value: string[]) => {
    const types = tagOptions.map((t: any) => t.value);
    const userTypesSelections = value.filter((s) => types.includes(s));
    const customSelections = value.filter((s) => !types.includes(s));
    if (value.length === 0)
      setOptions(options.filter((o) => !selections.includes(o.value)));
    onCustomFilterChange(customSelections);
    onTagFilterChange(userTypesSelections);
  };
  return (
      <CreatableSelect
        options={tagOptions}
        placeholder="Fitlro"
        isMulti
        isSearchable
        formatCreateLabel={(input) => (
          <Text>
            Filtro personalizado: <b>{input}</b>
          </Text>
        )}
        createOptionPosition="first"
        onChange={(option) => handleChange(option.map((o) => o.value))}
      ></CreatableSelect>
  );
  // return (<Menu fluid>
  //     <Menu.Item><Icon name="filter" /></Menu.Item>

  //     <Dropdown
  //         options={options}
  //         placeholder="Filtro"
  //         search
  //         selection
  //         fluid
  //         multiple
  //         allowAdditions
  //         defaultValue={defaultTagFilters}
  //         additionLabel="Personalizado: "
  //         onAddItem={(e, d) => handleAddition(d.value as string)}
  //         onChange={(e, d) => handleChange(d.value as string[])}
  //     /></Menu>
  // )
};
