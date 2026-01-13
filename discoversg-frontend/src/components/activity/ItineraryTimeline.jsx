import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "../../css/App.css";
import "react-vertical-timeline-component/style.min.css";
import { Button } from "@mui/material";

const ItineraryTimeline = ({ itinerary }) => {
  return (
    <VerticalTimeline className="p-5! color m-0! w-full! relative">
      {/* Hardcoded - will do mapping in future commit */}
      <VerticalTimelineElement
        iconStyle={{
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        style={{
          margin: '10px 0'
        }}
        icon={<span>11AM</span>}
      >
        <h3>Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        iconStyle={{
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        style={{
          margin: '10px 0'
        }}
        icon={<span>11AM</span>}
      >
        <h3>Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        iconStyle={{
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        style={{
          margin: '10px 0'
        }}
        icon={<span>11AM</span>}
      >
        <h3>Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
            <VerticalTimelineElement
        iconStyle={{
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        style={{
          margin: '10px 0'
        }}
        icon={<span>11AM</span>}
      >
        <h3>Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
            <VerticalTimelineElement
        iconStyle={{
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
        style={{
          margin: '10px 0'
        }}
        icon={<span>11AM</span>}
      >
        <h3>Testing</h3>
        <p>Testing123</p>
      </VerticalTimelineElement>
        <Button
          variant="contained"
          sx={{ bgcolor: '#0d9488', borderRadius: 2, textTransform: 'none', fontWeight: 'bold', position: 'absolute', top: '75%', left: '35%' }}
        >
          View Current Itinerary
        </Button>
    </VerticalTimeline>
  )
}

export default ItineraryTimeline;