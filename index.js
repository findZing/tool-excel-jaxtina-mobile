const xlsx = require("xlsx");
const fs = require("fs");
const { v4: uuidv4, v4 } = require("uuid");

// const pathLesson = "/Users/manhnguyenhuu/Desktop/Jaxtina/jaxtina-mobile/app/screens/Courses/assets/data/4SKILLS_PRE_S/lessons/"
//Đường dẫn nơi lưu trữ file
const pathLesson = "./Course/"
//Lesson Cần Update | Để trống thì update toàn bộ lesson
const lessonNeedUpdate = []
//Dạng Cần Update | Để trống thì update toàn bộ dạng
const dangNeedUpdate = ["P8"]
//Tên khóa học
const khoaHocName = "4SKILLS_PRE_S" // hoặc 4SKILLS_PRE_S hoặc hoặc 4SKILLS_S
//Tên sheetName trong excel
const _4SkillsSheetName = "4skills.PreS" //4skills.PreS hoặc 4Skills.S

const {
  COMMON,
  MAP_DANG_BAI_DANG_CAC_PHAN,
  MAP_SHEET_NAMES,
  CAC_KY_NANG,
} = require("./constants");
const { changeSubEnglish } = require("./utils");

var fileData = xlsx.readFileSync(COMMON.DATA_FILE.PRES);
var sheets = fileData.SheetNames;
var danhSachCauHoi = [];
var folderNames = [];

var tuMoiData = xlsx.readFileSync(COMMON.DATA_FILE.TUMOI)
var tuMoiSheetName = tuMoiData.SheetNames;
console.log(tuMoiSheetName)
var tuMoiJson = xlsx.utils.sheet_to_json(tuMoiData.Sheets['Từ vựng'])
var tuMoiList = []
for(tu of tuMoiJson) {
 if(tu["Từ mới"])
 {
  tuMoiList.push(tu["Từ mới"].trim())
 }
}

for (let i = 0; i < tuMoiList.length; i++) {
  for (let j = i; j < tuMoiList.length; j++) {
    if (tuMoiList[i].length < tuMoiList[j].length) {
      const item = tuMoiList[i]
      tuMoiList[i] = tuMoiList[j]
      tuMoiList[j] = item
    }
  }
}
// console.log(sheets)

function getJson(file, sheet) {
  return xlsx.utils.sheet_to_json(
    isNaN(sheet) ? file.Sheets[sheet] : file.Sheets[sheets[sheet]]
  );
}

function filterByCauHoi(data, cauHoi) {
  return data.filter((e) => {
    return e["Thuộc câu hỏi "] == cauHoi["Câu hỏi"];
  });
}

function filterByBaiHoc(data, baiHoc) {

  return data.filter((e) => {
    // if (baiHoc.Lesson == 12 && e["Thuộc bài"] && e["Thuộc bài"].includes("MINI TEST "+ (baiHoc.Lesson/4 - baiHoc.Lesson % 4)) && baiHoc["Tên"].includes("MINI TEST")) {
    //   console.log("Lesson Index: ", e["Thuộc bài"] && e["Thuộc bài"].includes("MID-TERM TEST") && baiHoc["Tên"].includes("MID-TERM"))
    // }
    //   console.log(baiHoc.Lesson/4 - baiHoc.Lesson % 4)
    if (e["Thuộc bài"] && e["Thuộc bài"].includes("MINI TEST " + (baiHoc.Lesson / 4 - baiHoc.Lesson % 4)) && baiHoc["Tên"].includes("MINI TEST")) {
      // console.log(baiHoc["Tên"], baiHoc.Lesson)
      return true
    }

    if (e["Thuộc bài"] && e["Thuộc bài"].includes("MID-TERM TEST") && baiHoc["Tên"].includes("MID-TERM")) {
      // console.log(baiHoc["Tên"], baiHoc.Lesson)
      return true
    }
    return e["Thuộc bài"]?.trim().toLowerCase().replaceAll(" ", "").replaceAll("&", "").replaceAll("-", "").replaceAll("\n", "") == baiHoc["Tên"]?.trim().toLowerCase().replaceAll(" ", "").replaceAll("&", "").replaceAll("-", "").replaceAll("\n", "");
  });
}

function filterByLesson(lesson, index) {
  return lesson.filter((e) => {
    return e["Lesson"] == index;
  });
}

function isNormalQuestionOrNot(cauHoi) {
  return cauHoi["Là câu hỏi nhỏ"].includes("Câu hỏi thường");
}

function writeFileJson(data, folderName, index) {
  fs.writeFileSync(
    folderName + "/" + "Part_" + index + ".json",
    JSON.stringify(data, null, 2)
  );
}

function getDangBaiHoc(cacDangBaiHoc, dang, ten) {
  // console.log(cacDangBaiHoc[0], dang)
  if (dang.toLowerCase() == "test") {
    // console.log(ten)
    if (ten.toLowerCase().includes("mini test")) {
      return {
        P1: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 1"],
        P2: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 2"],
        P3: cacDangBaiHoc[cacDangBaiHoc.length - 2].__EMPTY,
        P4: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 3"],
        P5: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 4"],
        P6: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 5"],
        P7: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 6"],
        P8: cacDangBaiHoc[cacDangBaiHoc.length - 2]["Phần 7"],
      };
    }
    if (
      ten.toLowerCase().includes("mid-term") ||
      ten.toLowerCase().includes("final")
    ) {
      return {
        P1: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 1"],
        P2: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 2"],
        P3: cacDangBaiHoc[cacDangBaiHoc.length - 1].__EMPTY,
        P4: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 3"],
        P5: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 4"],
        P6: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 5"],
        P7: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 6"],
        P8: cacDangBaiHoc[cacDangBaiHoc.length - 1]["Phần 7"],
      };
    }
  }
  for (let i = 0; i < cacDangBaiHoc.length; i++) {
    // console.log("Dang: ", i, cacDangBaiHoc[i]["Các dạng"])
    if (cacDangBaiHoc[i]["Các dạng"].includes(dang)) {
      return {
        P1: cacDangBaiHoc[i]["Phần 1"],
        P2: cacDangBaiHoc[i]["Phần 2"],
        P3: cacDangBaiHoc[i].__EMPTY,
        P4: cacDangBaiHoc[i]["Phần 3"],
        P5: cacDangBaiHoc[i]["Phần 4"],
        P6: cacDangBaiHoc[i]["Phần 5"],
        P7: cacDangBaiHoc[i]["Phần 6"],
        P8: cacDangBaiHoc[i]["Phần 7"],
      };
    }
  }
}

var baiHoc = getJson(fileData, MAP_SHEET_NAMES.DANH_SACH_CAC_BAI),
  phatAmData = getJson(fileData, MAP_SHEET_NAMES.PRONUNCIATION),
  tuVungData = getJson(fileData, MAP_SHEET_NAMES.VOCALBULARY),
  ngheData = getJson(fileData, MAP_SHEET_NAMES.NGHE),
  ngheDapAnData = getJson(fileData, MAP_SHEET_NAMES.NGHE_DAP_AN),
  docData = getJson(fileData, MAP_SHEET_NAMES.DOC),
  docDapAnData = getJson(fileData, MAP_SHEET_NAMES.DOC_DAP_AN),
  vietData = getJson(fileData, MAP_SHEET_NAMES.VIET),
  vietDapAnData = getJson(fileData, MAP_SHEET_NAMES.VIET_DAP_AN),
  noiData = getJson(fileData, MAP_SHEET_NAMES.NOI),
  noiDapAnData = getJson(fileData, MAP_SHEET_NAMES.NOI_DAP_AN),
  cacDangBaiHoc = getJson(fileData, MAP_SHEET_NAMES.CAC_DANG_BAI_HOC),
  _4Skills = getJson(fileData, _4SkillsSheetName),
  tuVungVideo = getJson(fileData, MAP_SHEET_NAMES.TU_VUNG),
  vocalbularyScript = getJson(fileData, MAP_SHEET_NAMES.SCRIPT_VOCABURALY),
  videoPractice = getJson(fileData, MAP_SHEET_NAMES.VIDEO_PRACTICE)
grammarVideo = getJson(fileData, MAP_SHEET_NAMES.GRAMMAR_VIDEO),
  practiceVideoTime = getJson(fileData, MAP_SHEET_NAMES.VIDEO_PRACTICE_TIME)
  ;

for (lesson of _4Skills) {
  // console.log("Các dạng bài học: ", cacDangBaiHoc, lesson["Dạng bài APP (4skills)"],
  //   lesson["Tên"])
  const cacDangCuaLesson = getDangBaiHoc(
    cacDangBaiHoc,
    lesson["Dạng bài APP (4skills)"],
    lesson["Tên"]
  );
  // console.log(cacDangCuaLesson, lesson.Lesson, lesson["Tên"])
  const folderName = pathLesson + lesson.Lesson
  //__dirname + "/" + "CourseS" + "/" + lesson.Lesson;
  // console.log(folderName)
  let indexError = 0;
  if (lessonNeedUpdate.length === 0 || (
    lessonNeedUpdate.length > 0 && lessonNeedUpdate.includes(lesson.Lesson)
  )) {
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      folderNames.push(folderName);

      Object.values(cacDangCuaLesson).map((item, index) => {
        //   // P4
        indexError = index
        if (item && item.includes("P4") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P4")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P4",
            elementType: "READING",
          };
          let docs = filterByBaiHoc(docData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(docDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
                _id: {
                  $oid: v4(),
                },
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: doc["Nội dung"],
                yNghia: doc["Giải thích"].replaceAll("</span>", "</span> "),
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P5") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P5")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P5",
            elementType: "READING",
          };
          let docs = filterByBaiHoc(docData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(docDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: doc["Nội dung"],
                yNghia: doc["Giải thích"],
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P3") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P3")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P3",
            elementType: "READING",
          };
          let docs = filterByBaiHoc(docData, lesson);
          if (lesson.Lesson == 2) console.log(lesson["Tên"])
          // console.log(lesson.Lesson)
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;
          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(docDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: doc["Nội dung"],
                yNghia: doc["Giải thích"]
                      .replaceAll("<i> ", " <i>")
                      .replaceAll("<b> ", " <b>")
                      .replaceAll("<span> ", " <span>")
                      .replaceAll("<span style=\\\"color:red\\\"> ", " <span style=\\\"color:red\\\">")
                      .replaceAll("<span style=\\\"color:blue\\\"> ", " <span style=\\\"color:blue\\\">")
                      .replaceAll("<span style=\"color:red\"> ", " <span style=\"color:red\">")
                      .replaceAll(" </i>", "</i> ")
                      .replaceAll(" </b>", "</b> ")
                      .replaceAll(" </span>", "</span> ")
                ,
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P9.1") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P9.1")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P9Cham1",
            elementType: "LISTENING",
          };
          let docs = filterByBaiHoc(ngheData, lesson);
          // console.log(docs)
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;
          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];

            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(ngheDapAnData, doc);

            ngheDapAnData.filter((e) => {
              // if(doc["Câu hỏi"].trim() == e["Thuộc câu hỏi "].trim()) console.log(true)

              return e["Thuộc câu hỏi "] == doc["Câu hỏi"];
            });//
            let NomarlQuestionHasUrlOrNot = false

            for (dapAn of dapAns) {
              // console.log(dapAn["Nội dung"], dapAn["Đáp án đúng ?"])
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            console.log(isNormalQuestionOrNot(doc), DanhSachDapAn)
            if (isNormalQuestionOrNot(doc)) {
              // console.log(doc.STT, lesson.Lesson)
              if (doc['Audio Link']) {
                DanhSachCauHoi.push({
                  _id: {
                    $oid: v4(),
                  },
                  cauHoiNho: [],
                  cauHoi: doc["Nội dung"],
                  yNghia: doc["Giải thích"],
                  danhSachDapAn: [],
                  audioUrl: khoaHocName + "_L" + lesson.Lesson + "/sounds/normal/" + doc["Audio Link"]
                });
                normalQuestionIndex = DanhSachCauHoi.length - 1;
                NomarlQuestionHasUrlOrNot = true
              }
              else {
                NomarlQuestionHasUrlOrNot = false
              }
            }
            if (!isNormalQuestionOrNot(doc)) {
              // console.log(normalQuestionIndex, lesson.Lesson, doc, DanhSachCauHoi[normalQuestionIndex])
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }

        if (item && item.includes("P2") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P2")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P2",
            elementType: "LISTENING",
          };
          let docs = filterByBaiHoc(ngheData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(ngheDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: khoaHocName + "_L" + lesson.Lesson + "/sounds/normal/S_" + lesson.Lesson + "_LISTENING_Listening " + (i + 1) + ".mp3",//doc["Nội dung"],
                yNghia: doc["Giải thích"],
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P1") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P1")
          )
        )) {
          // console.log(item, folderName)
          // if (lesson.Lesson == 4) console.log(lesson)
          let data = {
            dangCauHoi: "P1",
            elementType: "LISTENING",
          };
          let docs = filterByBaiHoc(ngheData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            let NomarlQuestionHasUrlOrNot = false

            const dapAns = filterByCauHoi(ngheDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              if (doc['Audio Link']) {
                DanhSachCauHoi.push({
                  _id: {
                    $oid: v4(),
                  },
                  cauHoiNho: [],
                  cauHoi: doc["Nội dung"],
                  yNghia: doc["Giải thích"],
                  danhSachDapAn: DanhSachDapAn,
                  soundCauhoi: khoaHocName + "_L" + lesson.Lesson + "/sounds/normal/" + doc["Audio Link"],
                  soundSlow: khoaHocName + "_L" + lesson.Lesson + "/sounds/slow/" + doc["Audio Link"]
                });
                normalQuestionIndex = DanhSachCauHoi.length - 1;
                NomarlQuestionHasUrlOrNot = true
              }
              else {
                NomarlQuestionHasUrlOrNot = false
              }
            }
            if (!isNormalQuestionOrNot(doc) && NomarlQuestionHasUrlOrNot) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P7") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P7")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P7",
            elementType: "WRITING",
          };
          let docs = filterByBaiHoc(vietData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(vietDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: doc["Nội dung"],
                yNghia: doc["Giải thích"],
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }

        if (item && item.includes("P0.1") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P0.1")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P0_1",
            elementType: "VOCABULARY",
          };
          let docs = filterByBaiHoc(tuVungData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            DanhSachCauHoi.push({
              _id: {
                $oid: v4(),
              },
              cauHoiNho: [],
              STT: i + 1,
              cauHoi: doc["TỪ/CỤM TỪ TIẾNG ANH"],
              yNghia: doc["TỪ/CỤM TỪ TIẾNG VIỆT"],
              danhSachDapAn: DanhSachDapAn,
            });
          }
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P6") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P6")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P6",
            elementType: "WRITING",
          };
          let docs = filterByBaiHoc(vietData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(vietDapAnData, doc);
            for (dapAn of dapAns) {
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                isCorrect: dapAn["Đáp án đúng ?"] == "Đúng" ? true : false,
              });
            }
            if (isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi.push({
                _id: {
                  $oid: v4(),
                },
                cauHoiNho: [],
                cauHoi: doc["Nội dung"],
                yNghia: doc["Giải thích"],
                danhSachDapAn: DanhSachDapAn,
              });
              normalQuestionIndex = DanhSachCauHoi.length - 1;
            }
            if (!isNormalQuestionOrNot(doc)) {
              DanhSachCauHoi[normalQuestionIndex].cauHoiNho.push({
                _id: {
                  $oid: v4(),
                },
                cauHoi: doc["Nội dung"],
                danhSachDapAn: DanhSachDapAn,
              });
              // console.log("Cau hoi nho: ", doc, DanhSachCauHoi[normalQuestionIndex], lesson.Lesson)
            }
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("P8") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P8")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P8",
            elementType: "SPEAKING",
            urlAudio:
              khoaHocName + "_L" +
              lesson.Lesson +
              "/sounds/normal/Normal_Speaking.mp3",
            urlAudioSlow:
              khoaHocName + "_L" +
              lesson.Lesson +
              "/sounds/normal/Slow_Speaking.mp3",
          };
          let docs = filterByBaiHoc(noiData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            const dapAns = filterByCauHoi(noiDapAnData, doc);
            for (dapAn of dapAns) {
              const phienAm = dapAn["Ý nghĩa"].split("<br />")[0];
              const yNghia = dapAn["Ý nghĩa"].split("<br />")[1];
              console.log(dapAn.Normal.split(":"))
              DanhSachDapAn.push({
                _id: {
                  $oid: v4(),
                },
                dapAn: dapAn["Nội dung"],
                phienAm,
                yNghia,
                normal: {
                  start: dapAn.Normal.split(":")[0] + ":" + dapAn.Normal.split(":")[1] + ":" + dapAn.Normal.split(":")[2],// + "." + dapAn.Normal.split(":")[3],
                  end: dapAn.__EMPTY.split(":")[0] + ":" + dapAn.__EMPTY.split(":")[1] + ":" + dapAn.__EMPTY.split(":")[2],// + "." + dapAn.__EMPTY.split(":")[3],
                },
                slow: {
                  start: dapAn.Slow.split(":")[0] + ":" + dapAn.Slow.split(":")[1] + ":" + dapAn.Slow.split(":")[2],// + "." + dapAn.Slow.split(":")[3],
                  end: dapAn.__EMPTY_1.split(":")[0] + ":" + dapAn.__EMPTY_1.split(":")[1] + ":" + dapAn.__EMPTY_1.split(":")[2],// + "." + dapAn.__EMPTY_1.split(":")[3],
                },
              });
            }
            DanhSachCauHoi.push({
              _id: {
                $oid: v4(),
              },
              cauHoiNho: [],
              cauHoi: doc["Nội dung"],
              danhSachDapAn: DanhSachDapAn,
            });
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }

        if (item && item.includes("P0.2") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P0.2")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "P0_2",
            elementType: "PRONUNCIATION",
          };
          let docs = filterByBaiHoc(phatAmData, lesson);
          let DanhSachCauHoi = [];

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            let tuMoi = doc["TỪ MỚI"];
            if (tuMoi[tuMoi.length - 1] === ".")
              tuMoi = tuMoi.slice(0, tuMoi.length - 1);
            const amThanh =
              khoaHocName + "_L" +
              lesson.Lesson +
              "/sounds/normal/S_" +
              lesson.Lesson +
              "_PRONUNCIATION_" +
              doc.STT +
              "." +
              tuMoi.toLowerCase().trim().replaceAll(" ", ".") +
              ".mp3";
            const amThanhCham =
              khoaHocName + "_L" +
              lesson.Lesson +
              "/sounds/slow/S_" +
              lesson.Lesson +
              "_PRONUNCIATION_" +
              doc.STT +
              "." +
              tuMoi.trim() +
              ".mp3";
            const hinhAnh =
              "4SKILLS_S_L" +
              lesson.Lesson +
              "/S_" +
              lesson.Lesson +
              "_PRONUNCIATION_" +
              doc.STT +
              "." +
              tuMoi.toLowerCase().trim().replaceAll(" ", ".") +
              ".png";
            const phienAm = doc["CÁCH PHÁT ÂM"];
            const loaiTu = doc["LOẠI TỪ"];
            const yNghia = doc["NGHĨA CỦA TỪ"];
            const tuKemTheo = doc["TỪ MỚI"];

            DanhSachCauHoi.push({
              _id: {
                $oid: v4(),
              },
              cauHoiNho: [],
              amThanh,
              amThanhCham,
              cauHoi: tuMoi + " " + phienAm + " (" + loaiTu + "): " + yNghia,
              yNghia,
              hinhAnh,
              phienAm,
              loaiTu, tuKemTheo,
              loaiBaiHoc: "IPA",
              dangCauHoi: "IPA_1",
            });
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }

        if (item && item.includes("P0") && !item.includes("P0.1") && !item.includes("P0.2") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("P0") && !dangNeedUpdate.includes("P0.1") && !dangNeedUpdate.includes("P0.2")
          )
        )) {
          // console.log(item)
          let data = {
            dangCauHoi: "P0",
            elementType: "VOCABULARY",
          };
          let docs = filterByBaiHoc(tuVungData, lesson);
          let DanhSachCauHoi = [];
          let DanhSachDapAn = [];
          let normalQuestionIndex = 0;

          for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            DanhSachDapAn = [];
            DanhSachCauHoi.push({
              _id: {
                $oid: v4(),
              },
              cauHoiNho: [],
              STT: i + 1,
              cauHoi: doc["TỪ/CỤM TỪ TIẾNG ANH"],
              yNghia: doc["TỪ/CỤM TỪ TIẾNG VIỆT"],
              danhSachDapAn: DanhSachDapAn,
            });
          }
          // console.log(doc)
          data.danhSachCauHoi = DanhSachCauHoi;
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("VocabularyVideo") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("VocabularyVideo")
          )
        )) {
          // console.log(item, folderName)
          let data = {
            dangCauHoi: "DangVideoPractise",
            elementType: "VIDEO1",
            loaiBai: "VOCABULARY",
            videoUrl: khoaHocName + "_L" + lesson.Lesson + "/vocabulary.mp4",
          };
          let newWordsVideo = filterByLesson(tuVungVideo, lesson.Lesson);
          let newWords = [];
          let newWordList = []

          for (let j = 0; j < newWordsVideo.length; j++) {
            const newWord = newWordsVideo[j]
            let word = newWord["Từ mới"];
            if (word) {
              newWordList.push(word)
              newWords.push({
                word: word.trim(),
                loaiTu: newWord["Loại từ"],
                phatAm: newWord["Cách phát âm"],
                meaning: newWord["Nghĩa của từ"],
                viDu: newWord["Ví dụ kèm theo"],
                urlSound:
                  "COURSE_VOCABULARY/sounds/" +
                  newWord.STT +
                  "." +
                  word
                    .toLowerCase()
                    .trim()
                    .replaceAll(",", "")
                    .replaceAll(".", "")
                    .replaceAll(" ", ".")
                    .replaceAll("?", "")
                    .replaceAll("’", "")
                    .replaceAll("'", "") +
                  ".mp3",
                urlImage:
                  "COURSE_VOCABULARY/pictures/" +
                  newWord.STT +
                  "." +
                  word
                    .toLowerCase()
                    .trim()
                    .replaceAll(",", "")
                    .replaceAll(".", "")
                    .replaceAll(" ", ".")
                    .replaceAll("?", "")
                    .replaceAll("’", "")
                    .replaceAll("'", "") +
                  ".png",
              });
            }
          }

          // let newOrderedWordList = [...newWordList]
          // for (let i = 0; i < newOrderedWordList.length; i++) {
          //   for (let j = i; j < newOrderedWordList.length; j++) {
          //     if (newOrderedWordList[i].length < newOrderedWordList[j].length) {
          //       const item = newOrderedWordList[i]
          //       newOrderedWordList[i] = newOrderedWordList[j]
          //       newOrderedWordList[j] = item
          //     }
          //   }
          // }

          let scriptVideos = filterByLesson(vocalbularyScript, lesson.Lesson);
          let scriptVideo = [];
          for (script of scriptVideos) {
            // console.log(script)
            const underlineScript = changeSubEnglish(script["Tiếng Anh"].trim(), tuMoiList)
            scriptVideo.push({
              start: script["Thời gian bắt đầu"],
              end: script["Thời gian kết thúc"],
              english: script["Tiếng Anh"].trim(),
              subScriptEnglish: underlineScript.newSubEnglish,
              matchedNewWords: underlineScript.matchedNewWords,
              vietnamese: script["Tiếng Việt"],
            });
          }

          const DanhSachCauHoi = []
          const practiceCauHoi = []
          const practiceDapAn = []

          let itemSave = ""
          let practiceIndex = 0
          let cauHoiIndex = ""
          let cauHoiIndexNumber = -1
          let name = ""
          const regex = /[\W\d+\.wav]/g
          for (let j = 0; j < videoPractice.length; j++) {
            const item = videoPractice[j]

            if (item["Lesson"] && item["Lesson"] == "Lesson " + lesson.Lesson + " VOCAB") {
              itemSave = "Lesson " + lesson.Lesson + " VOCAB"
            }
            else if (item["Lesson"] && item["Lesson"] !== "Lesson " + lesson.Lesson + " VOCAB") {
              itemSave = ""
            }
            if (itemSave === "Lesson " + lesson.Lesson + " VOCAB") {
              if (item["Câu hỏi"] && item["Câu hỏi"].includes("Practice")) {
                // console.log(item["Câu hỏi"].slice(8, -19).split(":")[1].replaceAll("-", "").trim().split(" ")[1])

                cauHoiIndexNumber = -1
                const time = item["Câu hỏi"].slice(-17)
                name = item["Câu hỏi"].split(":")[1].split("-")[0].trim().split(" ")[1]
                name = name.includes(".") ? name.split(".")[0] : name
                practiceIndex = (+item["Câu hỏi"].trim().split(" ")[1].replaceAll(":", "")) - 1
                // console.log(item["Câu hỏi"].trim().split(" ")[1].replaceAll(":", ""))
                // cons

                DanhSachCauHoi.push({
                  timeStart: time.split("-")[0].trim(),
                  timeEnd: time.split("-")[1].trim(),
                  done: false,
                  practice: {
                    done: false,
                    dangCauHoi: name,
                    danhSachCauHoi: []
                  }
                })

              }

              if (item["Câu hỏi"] && item["Câu hỏi"].includes("Câu hỏi")) {
                //       // console.log(item["Câu hỏi"].split(" ")[2].trim(), practiceIndex, DanhSachCauHoi[practiceIndex])
                if (cauHoiIndex !== item["Câu hỏi"].split(" ")[2].trim()) {
                  cauHoiIndex = item["Câu hỏi"].split(" ")[2].trim()
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                    cauHoiNho: [],
                    danhSachDapAn: [
                      {
                        _id: v4(),
                        dapAn: item["Đáp án"],
                      }
                    ]
                  })
                }
                else if (cauHoiIndex !== "" && cauHoiIndex === item["Câu hỏi"].split(" ")[2].trim()) {
                  // console.log(cauHoiIndex)
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[(+cauHoiIndex) - 1].danhSachDapAn.push({
                    _id: v4(),
                    dapAn: item["Đáp án"]
                  })
                }
              }

              if (!item["Câu hỏi"] && (item["Nội dung"] || item["Đáp án"] || item["Sai/Đúng"])) {
                if (item["Nội dung"]) {
                  cauHoiIndexNumber += 1
                  if (item["Sai/Đúng"]) {
                    if (name == "P1") {
                      console.log(item["audio"]?.search(regex), lesson.Lesson)
                      DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                        cauHoi: item["Nội dung"],
                        _id: v4(),
                        soundCauhoi: khoaHocName + "_L" + lesson.Lesson + "/sounds/video-practice/" + item["audio"],
                        danhSachDapAn: item["Đáp án"] ? [{
                          isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                          dapAn: item["Đáp án"],
                          _id: v4()
                        }] : []
                      })
                    }
                    else {
                      DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                        cauHoi: item["Nội dung"],
                        _id: v4(),
                        danhSachDapAn: item["Đáp án"] ? [{
                          isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                          dapAn: item["Đáp án"],
                          _id: v4()
                        }] : []
                      })
                    }
                  }
                  else {
                    DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                      cauHoi: item["Nội dung"].replaceAll("<span style=\"color:blue\"> <b>", " <b><span style=\"color:blue\">")
                        .replaceAll("<span style=\"color:blue\"><b>", " <b><span style=\"color:blue\">")
                        .replaceAll("</b></span>", "</span></b>")
                        .replaceAll("</b> </span>", "</span></b>")
                      ,
                      _id: {
                        $oid: v4()
                      },
                      yNghia: item["Đáp án"]
                    })
                  }
                }
                else if (cauHoiIndexNumber > -1) {
                  // if(item["Sai/Đúng"] == "Đúng" && name == "P1")
                  // {
                  //   console.log(DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].cauHoi)
                  //   DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].soundCauhoi += DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].cauHoi.replaceAll(" ", "").replaceAll(".", "").replaceAll("____", item["Đáp án"]).replaceAll("___", item["Đáp án"]).replaceAll("_", item["Đáp án"]) +".mp3"
                  // }
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].danhSachDapAn.push({
                    isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                    dapAn: item["Đáp án"],
                    _id: {
                      $oid: v4()
                    }
                  })
                }
              }
            }
          }
          data.newWords = newWords;
          data.scriptVideo = scriptVideo;
          data.danhSachCauHoi = DanhSachCauHoi
          writeFileJson(data, folderName, index + 1);
        }
        if (item && item.includes("GrammarVideo") && (
          dangNeedUpdate.length === 0 || (
            dangNeedUpdate.includes("GrammarVideo")
          )
        )) {
          let data = {
            dangCauHoi: "DangVideoPractise",
            elementType: "VIDEO1",
            loaiBai: "Grammar",
            videoUrl: khoaHocName + "_L" + lesson.Lesson + "/grammar.mp4",
          };

          const DanhSachCauHoi = []
          const practiceCauHoi = []
          const practiceDapAn = []

          let itemSave = ""
          let practiceIndex = 0
          let cauHoiIndex = ""
          let cauHoiIndexNumber = -1
          let name = ""
          for (let j = 0; j < videoPractice.length; j++) {
            const item = videoPractice[j]
            // console.log(item)
            if (item["Lesson"] && item["Lesson"] == "Lesson " + lesson.Lesson + " GRAMMAR") {
              itemSave = "Lesson " + lesson.Lesson + " GRAMMAR"
            }
            else if (item["Lesson"] && item["Lesson"] !== "Lesson " + lesson.Lesson + " GRAMMAR") {
              itemSave = ""
            }
            if (itemSave === "Lesson " + lesson.Lesson + " GRAMMAR") {
              if (item["Câu hỏi"] && item["Câu hỏi"].includes("Practice")) {
                // console.log(item["Câu hỏi"].slice(8, -19).split(":")[1].replaceAll("-", "").trim().split(" ")[1])

                cauHoiIndexNumber = -1
                const time = item["Câu hỏi"].slice(-17)
                console.log("Time: ", time)
                name = item["Câu hỏi"].split(":")[1].split("-")[0].trim().split(" ")[1]
                // console.log("Time: ", name, item["Câu hỏi"].split(":")[1].split("-")[0].trim().split(" ")[1])
                name = name.includes(".") ? name.split(".")[0] : name
                practiceIndex = (+item["Câu hỏi"].trim().split(" ")[1].replaceAll(":", "")) - 1
                // console.log(item["Câu hỏi"].trim().split(" ")[1].replaceAll(":", ""))
                // cons

                DanhSachCauHoi.push({
                  timeStart: time.split("-")[0].trim(),
                  timeEnd: time.split("-")[1].trim(),
                  done: false,
                  practice: {
                    done: false,
                    dangCauHoi: name,
                    danhSachCauHoi: []
                  }
                })

              }

              if (item["Câu hỏi"] && item["Câu hỏi"].includes("Câu hỏi")) {
                // console.log(item["Câu hỏi"].split(" ")[2].trim(), practiceIndex, DanhSachCauHoi[practiceIndex])
                if (cauHoiIndex !== item["Câu hỏi"].split(" ")[2].trim()) {
                  cauHoiIndex = item["Câu hỏi"].split(" ")[2].trim()
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                    cauHoiNho: [],
                    danhSachDapAn: [
                      {
                        _id: v4(),
                        dapAn: item["Đáp án"],
                      }
                    ]
                  })
                }
                else if (cauHoiIndex !== "" && cauHoiIndex === item["Câu hỏi"].split(" ")[2].trim()) {
                  // console.log(cauHoiIndex)
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[(+cauHoiIndex) - 1].danhSachDapAn.push({
                    _id: v4(),
                    dapAn: item["Đáp án"]
                  })
                }
              }

              if (!item["Câu hỏi"] && (item["Nội dung"] || item["Đáp án"] || item["Sai/Đúng"])) {
                if (item["Nội dung"]) {
                  cauHoiIndexNumber += 1
                  if (item["Sai/Đúng"]) {
                    if (name == "P1") {
                      DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                        cauHoi: item["Nội dung"],
                        _id: v4(),
                        soundCauhoi: khoaHocName + "_L" + lesson.Lesson + "/sounds/video-practice/" + item["audio"],
                        danhSachDapAn: item["Đáp án"] ? [{
                          isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                          dapAn: item["Đáp án"],
                          _id: v4()
                        }] : []
                      })
                    }
                    else {
                      DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                        cauHoi: item["Nội dung"],
                        _id: v4(),
                        danhSachDapAn: item["Đáp án"] ? [{
                          isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                          dapAn: item["Đáp án"],
                          _id: v4()
                        }] : []
                      })
                    }
                  }
                  else {
                    DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi.push({
                      cauHoi: item["Nội dung"].replaceAll("<span style=\"color:blue\"> <b>", "<b> <span style=\"color:blue\">")
                        .replaceAll("<span style=\"color:blue\"><b>", "<b> <span style=\"color:blue\">")
                        .replaceAll("</b></span>", "</span></b>")
                        .replaceAll("</b> </span>", "</span> </b>")
                      ,
                      _id: {
                        $oid: v4()
                      },
                      yNghia: item["Đáp án"]
                    })
                  }
                }
                else if (cauHoiIndexNumber > -1) {
                  // if(item["Sai/Đúng"] == "Đúng" && name == "P1")
                  // {
                  //   console.log(DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].cauHoi)
                  //   DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].soundCauhoi += DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].cauHoi.replaceAll(" ", "").replaceAll(".", "").replaceAll("____", item["Đáp án"]).replaceAll("___", item["Đáp án"]).replaceAll("_", item["Đáp án"]) +".mp3"
                  // }
                  DanhSachCauHoi[practiceIndex].practice.danhSachCauHoi[cauHoiIndexNumber].danhSachDapAn.push({
                    isCorrect: item["Sai/Đúng"] == "Đúng" ? true : false,
                    dapAn: item["Đáp án"],
                    _id: {
                      $oid: v4()
                    }
                  })
                }
              }
            }
          }

          // console.log(practiceVideoTime)
          const noiDungVideo = []
          practiceVideoTime.map((item, index) => {
            if (item['Dạng Video'] === 'Grammar' && +practiceVideoTime[index - 1].Lesson.trim().slice(0, 2) === lesson.Lesson) {
              const keys = Object.keys(item)
              keys.map((key, index) => {
                if (key.includes('Practice') && item[key] !== 'N/A') {
                  // console.log(key.split(' ')[1], lesson.Lesson)
                  const practiceIndex = +key.split(' ')[1]
                  const grammar = grammarVideo.filter((e) => {
                    return e['Lesson '] == lesson.Lesson
                  })
                  // console.log(grammarVideo)
                  noiDungVideo.push({
                    timeEnd: item[key],
                    noiDung: grammar[0]['Phần ' + practiceIndex]
                    .replaceAll("<i> ", " <i>")
                    .replaceAll("<b> ", " <b>")
                    .replaceAll("<span> ", " <span>")
                    .replaceAll("<span style=\\\"color:red\\\"> ", " <span style=\\\"color:red\\\">")
                    .replaceAll("<span style=\\\"color:blue\\\"> ", " <span style=\\\"color:blue\\\">")
                    .replaceAll(" </i>", "</i> ")
                    .replaceAll(" </b>", "</b> ")
                    .replaceAll(" </span>", "</span> ")
                  })
                }
              })
            }
          })

          data.danhSachCauHoi = DanhSachCauHoi
          data.noiDungVideo = noiDungVideo
          writeFileJson(data, folderName, index + 1);
        }
      });
    }
    catch (error) {
      console.log("Error to create new folder ", error, folderName, indexError);
    }
  }
}
// fs.writeFileSync(__dirname + '/P4.json', JSON.stringify(cacBaiHoc, null, 2));
