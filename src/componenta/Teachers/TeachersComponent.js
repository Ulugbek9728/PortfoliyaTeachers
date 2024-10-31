import React from 'react'
import './teacherDiogramm.css'
import Chart, {
    ArgumentAxis,
    Legend,
    Series,
    ValueAxis,
    Label,
    Export,
    Tick,
  } from 'devextreme-react/chart';
import Data from './data/simpleJSON.json'
import TeacherRating from '../TeacherRating/TeacherRating';
  const customizeText = (e) => `Day ${e.value}`;

const TeachersComponent = () => {
  return (<>
  <TeacherRating />
    <Chart
      title="Daily Sales"
      dataSource={Data}
      rotated={true}
      id="chart"
    >

      <ArgumentAxis>
        <Label customizeText={customizeText} />
      </ArgumentAxis>

      <ValueAxis>
        <Tick visible={false} />
        <Label visible={false} />
      </ValueAxis>
      <Series
        valueField="sales"
        argumentField="day"
        type="bar"
        color="#79cac4"
      >
        <Label visible={true} backgroundColor="#c18e92" />
      </Series>

      <Legend visible={false} />

      <Export enabled={true} />

    </Chart>
 </>)
    }


export default TeachersComponent