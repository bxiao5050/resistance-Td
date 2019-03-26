import {
  Notification,
  MessageBox
} from 'element-ui'
import FileSaver from 'file-saver'

import XLSX from 'xlsx'
// import Services from 'src/services'
// console.log(Services)
module.exports = {
  Notification,
  MessageBox,
  getElementTop: function (element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    return actualTop;
  },

  tableExport:function(id){//导出excel
      let wb = XLSX.utils.table_to_book(document.querySelector(id));
      let wbout = XLSX.write(wb, { bookType: 'xls', bookSST: true, type: 'array' });
      try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), Date.now()+'.xls')
      } catch (e) { 
          if (typeof console !== 'undefined') 
          console.log(e, wbout) 
      }
      return wbout
  },

  tableToExcel: (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        })
      }
    var dlink = document.createElement('a')
    dlink.id = "dlink"
    dlink.style.display = "none"
    document.body.appendChild(dlink)
    return function (table, name, filename) {
      var ctx = {
        worksheet: name || 'Worksheet',
        table: table.innerHTML
      }
      dlink.href = uri + base64(format(template, ctx));
      dlink.download = filename;
      dlink.click();
    }
  })(),



}