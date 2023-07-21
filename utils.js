const checkCumTuTrongCau = (cumTu, cau) => {
    const regex = /[a-z|A-Z|'|_]/
  
    const cau_ = cau.toLowerCase().replaceAll(".", "").replaceAll("’", "'").replaceAll(",", "")
    const cumTu_ = cumTu.toLowerCase().replaceAll(".", "").replaceAll("’", "'").replaceAll(",", "")
    const index = cau_.search(cumTu_)
    if (!(cau_[index - 1]?.search(regex) > -1) && !(cau_[index + cumTu_.length]?.search(regex) > -1)) return index
    return -1
  }
  
const changeSubEnglish = (subEnglish, newWords) => {
    const regex = /[a-z|A-Z|_]/
    let wordchanged = ""
    let newSubEnglish = subEnglish.trim()
  
    for (let i = 0; i < newWords.length; i++) {
      const index = checkCumTuTrongCau(newWords[i], newSubEnglish)
      if (index > -1 && !wordchanged.includes(newWords[i].toLowerCase())) {
        // console.log(index, newWords[i], subEnglish)
        wordchanged += newWords[i]
        let dauCumTu = 0
        let dauCau = 0
        let lengthCau = 0
        // console.log(newWords[i][0], subEnglish[index])
        for (let j = index; j < newSubEnglish.length; j++) {
          for (let z = j + dauCau; z < newSubEnglish.length; z++) {
            if (!newSubEnglish[z] || newSubEnglish[z].search(regex) > -1) break
            if (newSubEnglish[z] == '.' || newSubEnglish[z] === ',' ||
              newSubEnglish[z] == "'" || newSubEnglish[z] == "’" ||
              newSubEnglish[z] == " "
            ) {
              dauCau += 1
              // console.log("Dau Cau:", newSubEnglish[j + dauCau - 1])
            }
          }
  
          for (let z = j + dauCumTu - index; z < newWords[i].length; z++) {
            if (!newWords[i][z] || newWords[i][z].search(regex) > -1) break
            if (newWords[i][z] == '.' || newWords[i][z] === ',' ||
              newWords[i][z] == "'" || newWords[i][z] == "’" ||
              newWords[i][z] == " "
            ) {
              dauCumTu += 1
              // console.log("Dau Cum Tu: ", newWords[i][j + dauCumTu - index - 1])
            }
          }
  
          if (j == newSubEnglish.length - 1 || newSubEnglish[j + dauCau]?.toLowerCase() !== newWords[i]?.replaceAll("’", "'")[j + dauCumTu - index]?.toLowerCase()) {
            const tu = newSubEnglish.slice(index, j + (dauCau > dauCumTu ? dauCumTu : dauCau) + 1)
            // console.log("Tu: ", newSubEnglish, newWords[i], "//", tu, index, j, j + 1, newSubEnglish[j + dauCau], dauCau, newWords[i]?.replaceAll("’", "'")[j + dauCumTu - index], dauCumTu)
            newSubEnglish = newSubEnglish.replaceAll(tu, " _" + tu.replaceAll(" ", "_") + "_ ")
            break
          }
        }
      }
    }
    // console.log(newSubEnglish, subEnglish)
    return newSubEnglish
  }

  module.exports = {
    changeSubEnglish
  }