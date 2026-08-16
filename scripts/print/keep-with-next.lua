function Header(el)
  if el.level <= 3 then
    return {
      pandoc.RawBlock("tex", "\\needspace{7\\baselineskip}"),
      el
    }
  end
  return el
end

function CodeBlock(el)
  return {
    pandoc.RawBlock("tex", "\\needspace{8\\baselineskip}"),
    el
  }
end

function Table(el)
  return {
    pandoc.RawBlock("tex", "\\needspace{10\\baselineskip}"),
    el
  }
end
