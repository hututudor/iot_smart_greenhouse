import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip,
} from 'recharts'
import { getData } from './api'

const GRAPH_HEIGHT = 200
const GRAPH_WIDTH = 1000

export const App = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const _data = await getData()
      setData(_data)
      setLoading(false)
    }

    fetchData()
  })

  const wateringIntervals = getIntervals(data, 'watering')
  const sprayingIntervals = getIntervals(data, 'spraying')
  const sprayingTimeIntervals = getIntervals(data, 'sprayingTime')

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div
        style={{
          marginTop: 10,
          paddingLeft: 'auto',
          maxWidth: 1000,
        }}
      >
        <p style={{ fontSize: 20, marginLeft: 20, marginBottom: 20 }}>
          Soil's moisture
        </p>
        <LineChart width={GRAPH_WIDTH} height={GRAPH_HEIGHT} data={data}>
          <XAxis dataKey='time' />
          <YAxis />

          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<MoistureTooltip />}
          />

          <CartesianGrid stroke='#eee' />
          <Line type='monotone' dataKey='moist' stroke='blue' />

          {wateringIntervals.map(({ startTime, endTime }, i) => (
            <ReferenceArea
              key={i}
              x1={startTime}
              x2={endTime}
              fill='lightblue'
              fillOpacity={0.3}
            />
          ))}
        </LineChart>
      </div>

      <div
        style={{
          marginTop: 10,
          paddingLeft: 'auto',
          maxWidth: 1000,
        }}
      >
        <p style={{ fontSize: 20, marginLeft: 20, marginBottom: 20 }}>
          Temperature
        </p>
        <LineChart width={GRAPH_WIDTH} height={GRAPH_HEIGHT} data={data}>
          <XAxis dataKey='time' />
          <YAxis />

          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<TemperatureTooltip />}
          />

          <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
          <Line type='monotone' dataKey='temp' stroke='blue' />
        </LineChart>
      </div>

      <div
        style={{
          marginTop: 10,
          paddingLeft: 'auto',
          maxWidth: 1000,
        }}
      >
        <p style={{ fontSize: 20, marginLeft: 20, marginBottom: 20 }}>
          Pest Distance
        </p>
        <LineChart width={GRAPH_WIDTH} height={GRAPH_HEIGHT} data={data}>
          <XAxis dataKey='time' />
          <YAxis />

          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<PestTooltip />}
          />

          <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
          <Line type='monotone' dataKey='dist' stroke='blue' />

          {sprayingIntervals.map(({ startTime, endTime }, i) => (
            <ReferenceArea
              key={i}
              x1={startTime}
              x2={endTime}
              fill='gray'
              fillOpacity={0.3}
            />
          ))}

          {sprayingTimeIntervals.map(({ startTime, endTime }, i) => (
            <ReferenceArea
              key={i}
              x1={startTime}
              x2={endTime}
              fill='lightblue'
              fillOpacity={0.3}
            />
          ))}
        </LineChart>
      </div>
    </div>
  )
}

const MoistureTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null
  }

  const dataPoint = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <p>
        Time: <b>{label}</b>
      </p>
      <p>
        Moisture: <b>{dataPoint?.moist}</b>
      </p>
      <p>
        Watering: <b>{dataPoint?.watering ? 'yes' : 'no'}</b>
      </p>
    </div>
  )
}

const TemperatureTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null
  }

  const dataPoint = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <p>
        Time: <b>{label}</b>
      </p>
      <p>
        Temperature: <b>{dataPoint?.temp} °C</b>
      </p>
    </div>
  )
}

const PestTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null
  }

  const dataPoint = payload[0].payload
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <p>
        Time: <b>{label}</b>
      </p>
      <p>
        Pest Distance: <b>{dataPoint?.dist / 100}m</b>
      </p>
      <p>
        Wants To Spray: <b>{dataPoint?.sprayingTime ? 'yes' : 'no'}</b>
      </p>
      <p>
        Spraying: <b>{dataPoint?.spraying ? 'yes' : 'no'}</b>
      </p>
    </div>
  )
}

const getIntervals = (data, key) => {
  const res = []

  let action = false
  let startTime = ''

  for (const { time, [key]: isActing } of data) {
    if (action !== isActing) {
      if (isActing) {
        startTime = time
      } else {
        res.push({ startTime, endTime: time })
      }
      action = isActing
    }
  }

  if (action) {
    res.push({
      startTime,
      endTime: data[data.length - 1].time,
    })
  }

  return res
}
