const mockData = [
  {
    time: '10:00',
    moist: 125,
    temp: 30,
    dist: 336,
    watering: false,
    spraying: false,
    sprayingTime: false,
  },
  {
    time: '10:30',
    moist: 110,
    temp: 31,
    dist: 200,
    watering: false,
    spraying: false,
    sprayingTime: false,
  },
  {
    time: '11:00',
    moist: 100,
    temp: 35,
    dist: 100,
    watering: true,
    spraying: false,
    sprayingTime: true,
  },
  {
    time: '11:30',
    moist: 140,
    temp: 34,
    dist: 50,
    watering: true,
    spraying: true,
    sprayingTime: true,
  },
  {
    time: '12:00',
    moist: 165,
    temp: 32,
    dist: 70,
    watering: true,
    spraying: true,
    sprayingTime: true,
  },
  {
    time: '12:30',
    moist: 190,
    temp: 31,
    dist: 120,
    watering: true,
    spraying: false,
    sprayingTime: false,
  },
  {
    time: '13:00',
    moist: 190,
    temp: 33,
    dist: 180,
    watering: false,
    spraying: false,
    sprayingTime: false,
  },
  {
    time: '13:30',
    moist: 180,
    temp: 34,
    dist: 336,
    watering: false,
    spraying: false,
    sprayingTime: false,
  },
]

export const getData = async () => {
  // const res = await fetch('http://localhost:3001/data')
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const data = mockData.sort((a, b) => {
    const aTime = a.time.split(':')
    const bTime = b.time.split(':')
    return aTime[0] - bTime[0] || aTime[1] - bTime[1]
  })

  return data
}
