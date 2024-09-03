function scheduleHtmlParser(html) {
  const $ = cheerio.load(html, { decodeEntities: false })
  const result = []
  if (html === '') return result
  $("#kb tbody tr").each((i, tr) => {
    if (i === 0) return
    $(tr)
      .children()
      .each((j, td) => {
        if (j === 0) return
        const day = parseInt(j)
        if ($(td).find("p").length === 0) return
        const text = $(td).find("p").html()
        // 多节课
        if ($(td).find("p").html().includes("<br>")) {
          const parts = text.split("<br>")
          parts.forEach((part) => {
            const item = getClassItem(part)
            const lesson = result.filter(
              (r) => r.day === day && r.name === item.name
            )
  
            if (lesson && lesson.length > 0) {
              lesson[0].sections.push(i)
            } else {
              result.push({
                ...item,
                day,
                sections: [i],
              })
            }
          })
        } else {
          const item = getClassItem($(td).find('p').html())
          const lesson = result.filter(
            (r) => r.day === day && r.name === item.name
          )
          if (lesson && lesson.length > 0) {
            lesson[0].sections.push(i)
          } else {
            result.push({
              ...item,
              day,
              sections: [i],
            })
          }
        }
      })
  })
  return result
}

function getClassItem(part) {
  const inner = cheerio.load(part)
  const [name, week, position] = inner("span").map((i, el) => inner(el).text().trim()).get()
  let teacher = ""

  const resText = cheerio
    .load(`<div>${part}</div>`)("div")
    .contents()
    .filter((index, element) => element.type === "text")
  const textList = resText.text().trim().split(" ")
  console.log(textList);
  
  if (textList.length > 1) {
    teacher = textList[1]
  }
  const [start, end] = week
    .split(" ")[1]
    .split("-")
    .map((w) => parseInt(w))
  const weeks = []
  for (let i = start; i <= end; i++) {
    weeks.push(i)
  }

  return {
    name,
    position,
    teacher,
    weeks,
    // sections: [],
  }
}
