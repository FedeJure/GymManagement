import { utils, write } from "xlsx"
import { IconButton, Tooltip } from "@chakra-ui/react";
import { IoIosDownload } from "react-icons/io";

function s2ab(s: string) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

export const ExcelDownloader = ({ data, name }: {data: any, name: string }) => {

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
    return (
      <Tooltip label="Descargar usuarios a excel">
        <IconButton
          aria-label="Descargar excel"
          icon={<IoIosDownload />}
          onClick={handleClick}
        />
      </Tooltip>
    );

}