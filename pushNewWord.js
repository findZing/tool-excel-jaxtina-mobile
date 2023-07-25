const xlsx = require("xlsx");
const fs = require("fs");
const { v4: uuidv4, v4 } = require("uuid");
const axios = require('axios');

const {
    COMMON,
    MAP_DANG_BAI_DANG_CAC_PHAN,
    MAP_SHEET_NAMES,
    CAC_KY_NANG,
} = require("./constants");

var tuMoiData = xlsx.readFileSync(COMMON.DATA_FILE.TUMOI)
var tuMoiSheetName = tuMoiData.SheetNames;
console.log(tuMoiSheetName)
var tuMoiJson = xlsx.utils.sheet_to_json(tuMoiData.Sheets['Từ vựng'])
var tuMoiList = []

const pushToData = async () => {
    for (tu of tuMoiJson) {
        if (tu["Từ mới"]) {
            const tuMoi = tu["Từ mới"]
            const word =
            {
                tu: tuMoi.trim(),
                loaiTu: tu["Loại từ"],
                cachPhatAm: tu["Cách phát âm"],
                yNghia: tu["Nghĩa của từ"],
                viDu: tu["Ví dụ kèm theo"],
                amThanh:
                    "COURSE_VOCABULARY/sounds/" +
                    tu.STT +
                    "." +
                    tuMoi
                        .toLowerCase()
                        .trim()
                        .replaceAll(",", "")
                        .replaceAll(".", "")
                        .replaceAll(" ", ".")
                        .replaceAll("?", "")
                        .replaceAll("’", "")
                        .replaceAll("'", "") +
                    ".mp3",
                hinhAnh:
                    "COURSE_VOCABULARY/pictures/" +
                    tu["Hình ảnh"].split("/")[tu["Hình ảnh"].split("/").length - 1],
            }
            try {
                axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                const wordData = await axios({
                    method: 'post',
                    url: 'http://localhost:3005/new-word/add-into-db',
                    data: word
                  });
                
                // axios.post('http://localhost:3005/new-word/add-into-db', word)
                // if(wordData.data.word !== null) {
                //     console.log("Successfully")
                // }
                // else {
                //     console.log("Failed")
                // }
                console.log(wordData.data)
                // console.log(word)
            } catch (error) {
                console.log("Failed ", error)
            }
        }
    }
}

pushToData()