import { FormEvent, useState } from "react"
import { Dropdown, Input, Form } from 'semantic-ui-react'
import { UserType } from "../../modules/users/UserType"

export const FilterInput = () => {
    const [selections, setSelections] = useState<string[]>([])

    return (
        <Dropdown selection
            multiple
            text="Filtro"
            icon='filter'
            className='icon'
            floating
            labeled
            allowAdditions
            header={<>
                <Form onSubmit={(e: FormEvent) => e.stopPropagation()}>
                    <Form.Input onClick={(e: InputEvent) => e.stopPropagation()} focus icon='search' iconPosition='left' name='search' />
                </Form>
            </>}
            options={[...[UserType.ADMIN, UserType.STUDENT, UserType.TRAINER].map(t =>
            ({
                key: t,
                text: t,
                value: t,
            }))]} />
    )
}