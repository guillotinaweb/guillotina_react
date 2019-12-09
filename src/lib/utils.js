

export const formatDate = (str) => {
  const d = new Date(str)
  const minutes = (d.getMinutes() < 10) ? `0${d.getMinutes()}` : d.getMinutes()
  return `${d.getDate()}/${d.getMonth() +1}/${d.getFullYear()} ${d.getHours()}:${minutes}`
}
