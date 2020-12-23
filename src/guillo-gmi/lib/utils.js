export const formatDate = (str) => {
  const d = new Date(str)
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  return `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} ${d.getHours()}:${minutes}`
}

export const getErrorMessage = (dataError) => {
  const result = '';
  if(dataError && dataError.details){
    return dataError.details
  } else if(dataError && dataError.reason){
    return dataError.reason
  }
  return result;

}