import { useState } from "react"
import { Dropdown, SemanticShorthandItem, LabelProps, Icon, Menu } from 'semantic-ui-react'

export const FilterInput = ({ onUserTypeFilterChange, onCustomChange, tagOptions, defaultValues=[] }
    : { onUserTypeFilterChange: Function, onCustomChange: Function, tagOptions: any[], defaultValues?: string[] }) => {
    const [selections, setSelections] = useState<string[]>([])
    const [options, setOptions] = useState<{ key: string, value: string, text: string, label: SemanticShorthandItem<LabelProps> }[]>(tagOptions)

    const handleAddition = (value: string) => {
        setSelections([...selections, value])
        setOptions([...options, { key: value, value, text: value, label: null }])
    }
    const handleChange = (value: string[]) => {
        const types = tagOptions.map((t: any) => t.value)
        const userTypesSelections = value.filter(s => types.includes(s))
        const customSelections = value.filter(s => !types.includes(s))
        if (value.length === 0) setOptions(options.filter(o => !selections.includes(o.value)))
        onCustomChange(customSelections)
        onUserTypeFilterChange(userTypesSelections)
    }
    return (<Menu fluid>
        <Menu.Item><Icon name="filter" /></Menu.Item>

        <Dropdown
            options={options}
            placeholder="Filtro"
            search
            selection
            fluid
            multiple
            allowAdditions
            defaultValue={defaultValues}
            additionLabel="Personalizado: "
            onAddItem={(e, d) => handleAddition(d.value as string)}
            onChange={(e, d) => handleChange(d.value as string[])}
        /></Menu>
    )
}