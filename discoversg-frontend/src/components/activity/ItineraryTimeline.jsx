import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "../../css/App.css";
import "react-vertical-timeline-component/style.min.css";
import { Button } from "@mui/material";

const ItineraryTimeline = ({ itinerary }) => {
  return (
    <VerticalTimeline className="p-5! color m-0! w-full! relative">
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{ left: 'calc(100% - 10px)' }}
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <h3 className="vertical-timeline-element-title">Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{ left: 'calc(100% - 10px)' }}
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <h3 className="vertical-timeline-element-title">Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentArrowStyle={{ left: 'calc(100% - 10px)' }}
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <h3 className="vertical-timeline-element-title">Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement>
        <h2>Testing</h2>
        <p>Testing123</p>
      </VerticalTimelineElement>
      
      <Button variant="contained" 
      onClick={() => {}} 
      sx={{ backgroundColor: '#6750A4', position: 'absolute', top: '67%', left: '43%' }}
      >
        Test
      </Button>
    </VerticalTimeline>
  )
}

export default ItineraryTimeline;