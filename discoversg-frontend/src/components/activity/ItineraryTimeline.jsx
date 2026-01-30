import { VerticalTimelineElement } from "react-vertical-timeline-component";
import "../../css/App.css";
import "react-vertical-timeline-component/style.min.css";

const ItineraryTimeline = ({ itineraryDetail }) => {
  console.log(itineraryDetail);
  return (
    <VerticalTimelineElement
      iconStyle={{
        background: '#3b82f6',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.8rem',
      }}
      style={{
        margin: '10px 0'
      }}
      icon={<span>{itineraryDetail.time}</span>}
    >
      <h4>{itineraryDetail.place_name}</h4>
    </VerticalTimelineElement>
  )
}

export default ItineraryTimeline;