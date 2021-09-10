import { ChangeEvent, useRef } from "react"
import { utils, read } from "xlsx"
import { Button, ButtonProps } from "semantic-ui-react";

const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-exce"]

export const ExcelUploader = ({floated, onLoad}: ButtonProps & {onLoad: Function}) => {
    const fileRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (!files) return
        const file = files[0]
        if (!file) return
        if (!allowedTypes.includes(file.type)) {
            event.currentTarget.value = ""
            return
        }

        const reader = new FileReader();
        reader.onload = (evt) => { 
            if (!evt.target) return
            const bstr = evt.target.result;
            const wb = read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = utils.sheet_to_json(ws);
            onLoad(data)
        };
        reader.readAsBinaryString(file);
        event.currentTarget.value = ""
    }

    return (<>
        <Button floated={floated} icon="file excel outline" primary onClick={() => {
            var ref = fileRef.current
            if (ref !== null) {
                ref.click()
            }
        }} />
        <input ref={fileRef} type="file" hidden onChange={handleImageChange} />
    </>);
}