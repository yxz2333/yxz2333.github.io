export function slugify(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
}

export function cleanHeading(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$\$[\s\S]+?\$\$/g, '')   // $$...$$ 太宽，删除
    .replace(/\s+/g, ' ')
    .trim()
}
