import katex from 'katex'

export function renderLatex(html) {
  if (!html) return ''
  let result = html
  // \[...\] → display math（等同于 $$...$$）
  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (m, latex) => {
    if (!latex.trim()) return m
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: true })
    } catch {
      return '<pre class="text-red-400 text-xs">' + latex + '</pre>'
    }
  })
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (m, latex) => {
    if (!latex.trim()) return m
    try {
      return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: true })
    } catch {
      return '<pre class="text-red-400 text-xs">' + latex + '</pre>'
    }
  })
  // \(...\) → inline math（LaTeX 标准行内写法）
  result = result.replace(/\\\((.+?)\\\)/g, (m, latex) => {
    if (!latex.trim()) return m
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: true })
    } catch {
      return '<code class="text-red-400">' + latex + '</code>'
    }
  })
  result = result.replace(/\$(.+?)\$/g, (m, latex) => {
    if (!latex.trim()) return m
    try {
      return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: true })
    } catch {
      return '<code class="text-red-400">' + latex + '</code>'
    }
  })
  return result
}
