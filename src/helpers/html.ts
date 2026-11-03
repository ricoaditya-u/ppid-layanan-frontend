export function sanitizeInlineHtml(htmlString: string): string {
  if (!htmlString || typeof htmlString !== 'string') {
    return ''
  }

  let cleaned = htmlString.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  cleaned = cleaned.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
  cleaned = cleaned.replace(/\son\w+="[^"]*"/gi, '')
  cleaned = cleaned.replace(/\son\w+='[^']*'/gi, '')
  cleaned = cleaned.replace(/\shref="javascript:[^"]*"/gi, ' ')
  cleaned = cleaned.replace(/\ssrc="javascript:[^"]*"/gi, ' ')

  return cleaned
}
