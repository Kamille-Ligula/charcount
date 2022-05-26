const excel = require('excel4node');

exports.createExcelFile = async (wordsWithDefinitions, userName) => {
  let workbook = new excel.Workbook();

  let worksheet = workbook.addWorksheet('Words');

  const style = workbook.createStyle({
    font: {
      color: '#000000',
      size: 12
    },
  });

  //worksheet.cell(1,5).string('Occurences').style(style);
  worksheet.cell(1,1).string('HSK level').style(style);
  worksheet.cell(1,2).string('Word').style(style);
  worksheet.cell(1,3).string('Pinyin').style(style);
  worksheet.cell(1,4).string('Meaning').style(style);

  let offset = 0;

  for (let i=0; i<wordsWithDefinitions.length; i++) {
    let objectvalues = Object.values(wordsWithDefinitions[i].definitions);

    //worksheet.cell(2+offset,5).number(wordsWithDefinitions[i].count).style(style);
    worksheet.cell(2+offset,1).string(wordsWithDefinitions[i].hsk).style(style);
    worksheet.cell(2+offset,2).string(wordsWithDefinitions[i].traditional).style(style);
    for (let j=0; j<objectvalues.length; j++) {
      worksheet.cell(2+offset,3).string(objectvalues[j].pinyin).style(style);
      for (let k=0; k<objectvalues[j].translations.length; k++) {
        worksheet.cell(2+offset,4).string(objectvalues[j].translations[k]).style(style);
        if (k < objectvalues[j].translations.length-1) { offset++; }
      }
      if (j < objectvalues.length-1) { offset++; }
    }
    offset++;
  }

  workbook.write('./charcount/downloads/vocabulary_files/'+userName.replace(/\s/g, '-')+'-vocabulary-list.xlsx');
}
