export function placeholders(n){return Array.from({length:n},()=>'?').join(',')}
export function updateStatement(table,data,idField='id'){const keys=Object.keys(data);if(!keys.length)return null;return {sql:`UPDATE ${table} SET ${keys.map(k=>`${k}=?`).join(',')}, updated_at=CURRENT_TIMESTAMP WHERE ${idField}=?`,values:[...keys.map(k=>data[k])]}}
