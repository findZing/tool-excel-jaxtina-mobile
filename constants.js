module.exports = {
    COMMON: {
        DATA_FILE: {
            PRES: "./Khoa_hoc_PreS.xlsx",
            S: "./Khoa_hoc_S.xlsx",
            TC: "../template_data/Khoa_hoc_TC_template.xlsx",
            MTC: "../template_data/Khoa_hoc_MTC_template.xlsx",
            TUMOI: './Từ mới.xlsx'
        },
        DANG_KHOA_HOC: {
            "4SKILLS": {
                PRES: "4SKILLS_PRE_S",
                S: "4SKILLS_S",
                MTC: "4SKILLS_MTC",
                TC: "4SKILLS_TC",
            },
        },
    },
    CAC_KY_NANG: {
        VIET: "WRITING",
        NOI: "SPEAKING",
        DOC: "READING",
        NGHE: "LISTENING",
        TU_VUNG: "VOCABULARY",
        VIDEO1: "VIDEO1",
        VIDEO2: "VIDEO2",
        PHAT_AM: "PRONUNCIATION",
    },
    DRIVE_DOWNLOAD_URL_PREFIX: "https://drive.google.com/uc?export=download&id=",
    DANG_BAI: {
        DANG_1: 1,
        DANG_2: 2,
        DANG_3: 3,
        DANG_4: 4,
        DANG_5: 5,
        DANG_MINI_TEST: 6,
        DANG_MIDTERM_FINAL_TEST: 7,
    },
    MAP_DANG_BAI_DANG_CAC_PHAN: {
        VIDEO1: "DANG_VIDEO_1",
        PHAT_AM: "IPA_1", //Dang bai tu 1-5
        TU_VUNG: /* ['DANG_5' BE_AE , 'DANG_5_1'  DANG_MOI ] */ {
            1: "DANG_5",
            3: "DANG_5",
            5: "DANG_5",
            6: "DANG_5",
            7: "DANG_5",
            2: "DANG_5.1",
            4: "DANG_5.1",
        },
        VIDEO2: "DANG_VIDEO_2" /* Co giai thich, tom tat cau TextTrackCue, cach su dung bang tieng Viet */,
        NGHE: {
            1: "DANG_P9.1",
            2: "DANG_P1",
            3: "DANG_P2",
            4: "DANG_P1",
            6: "DANG_P1",
            7: "DANG_P1",
            5: "DANG_P2",
        },
        DOC: {
            1: "DANG_P3",
            3: "DANG_P3",
            7: "DANG_P3",
            2: "DANG_P4",
            5: "DANG_P4",
            6: "DANG_P4",
            4: "DANG_P5",
        },
        VIET: {
            1: "DANG_P6",
            4: "DANG_P6",
            6: "DANG_P6",
            2: "DANG_P7",
            3: "DANG_P7",
            5: "DANG_P7",
            7: "DANG_P7",
        },
        NOI: "DANG_P8",
    },
    MAP_SHEET_NAMES: {
        DANH_SACH_CAC_BAI: "Danh sách các bài",
        PRONUNCIATION: "Pronunciation",
        VOCALBULARY: "Vocabulary",
        NGHE: "Thực hành nghe",
        NGHE_DAP_AN: "Đáp án nghe",
        VIET: "Thực hành viết",
        VIET_DAP_AN: "Đáp án viết",
        DOC: "Thực hành đọc",
        DOC_DAP_AN: "Đáp án đọc",
        NOI: "Thực hành nói",
        NOI_DAP_AN: "Đáp án nói",
        DANG_BAI: "dạng bài",
        CAC_DANG_BAI_HOC: "Các dạng bài học",
        PRES_4SKILLS: "4skills.PreS",
        S_4SKILLS: "4Skills.S",
        TU_VUNG: "Kho Từ vựng",
        SCRIPT_VOCABURALY: "Script Vocabulary",
        VIDEO_PRACTICE: "PracticeVideo",
        GRAMMAR_VIDEO: "Grammar dưới Video",
        VIDEO_PRACTICE_TIME: "Practice Video Time"
    },
}
