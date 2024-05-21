export const getData = async () => {
  const res = await fetch('http://localhost:5000')
  const rawData = await res.json()

  const data = rawData.sort((a, b) => {
    const aTime = a.time.split(':')
    const bTime = b.time.split(':')
    return aTime[0] - bTime[0] || aTime[1] - bTime[1]
  })

  return data
}
