import { useState, useEffect } from "react"
import { Dropdown, SemanticShorthandItem, LabelProps, Icon, Menu } from 'semantic-ui-react'
import { UserType } from "../../modules/users/UserType"

const userTypes: string[] = [UserType.ADMIN, UserType.STUDENT, UserType.TRAINER]
export const FilterInput = ({ onUserTypeFilterChange, onCustomChange }
    : { onUserTypeFilterChange: Function, onCustomChange: Function }) => {
    const [selections, setSelections] = useState<string[]>([])
    const [options, setOptions] = useState<{ key: string, value: string, text: string, label: SemanticShorthandItem<LabelProps> }[]>([
        {
            key: UserType.ADMIN,
            text: UserType.ADMIN,
            value: UserType.ADMIN,
            label: { color: 'green', empty: true, circular: true }
        },
        {
            key: UserType.STUDENT,
            text: UserType.STUDENT,
            value: UserType.STUDENT,
            label: { color: 'yellow', empty: true, circular: true }
        },
        {
            key: UserType.TRAINER,
            text: UserType.TRAINER,
            value: UserType.TRAINER,
            label: { color: 'orange', empty: true, circular: true }
        }
    ])

    const handleAddition = (value: string) => {
        setSelections([...selections, value])
        setOptions([...options, { key: value, value, text: value, label: null }])
    }
    const handleChange = (value: string[]) => {
        const userTypesSelections = value.filter(s => userTypes.includes(s))
        const customSelections = value.filter(s => !userTypes.includes(s))
        onCustomChange(customSelections)
        onUserTypeFilterChange(userTypesSelections)
    }
    return (<Menu>
        <Menu.Item><Icon name="filter"/></Menu.Item>
        <Dropdown
            options={options}
            placeholder="Filtro"
            search
            selection
            fluid
            multiple
            allowAdditions
            onAddItem={(e, d) => handleAddition(d.value as string)}
            onChange={(e, d) => handleChange(d.value as string[])}
        /></Menu>
    )
}