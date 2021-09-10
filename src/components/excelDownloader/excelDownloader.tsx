import { utils, write } from "xlsx"
import { Button, ButtonProps } from "semantic-ui-react";

function s2ab(s: string) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

export const ExcelDownloader = ({ floated, data, name }: ButtonProps & { data: any, name: string }) => {

    const handleClick = () => {
        var wb = utils.book_new();
        wb.Props = {
            Title: name,
            Subject: "Aizen database",
            Author: "Aizen",
            CreatedDate: new Date()
        };
        wb.SheetNames.push(name);
        var ws = utils.json_to_sheet(data)
        wb.Sheets[name] = ws;
        var wbout = write(wb, { bookType: 'xlsx', type: 'binary' });
        var xlsxLink = window.URL.createObjectURL(new Blob([s2ab(wbout)],{type:"application/octet-stream"}));
        var tempLink = document.createElement('a');
        tempLink.href = xlsxLink;
        tempLink.setAttribute('download', `${name}.xlsx`);
        tempLink.click();
    }

    return (<Button floated={floated} icon="download" primary onClick={handleClick} />);
}