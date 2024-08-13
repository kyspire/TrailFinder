import { useNavigate } from "react-router-dom";
import './Home.css'

const TrailWidget = ({ trail, preview }) => {
    const navigate = useNavigate();

    const handleTrailWidgetClick = () => {
        navigate('/trail', {
            state: {
                locationname: trail.LOCATIONNAME, latitude: trail.LATITUDE, longitude: trail.LONGITUDE, trailname: trail.TRAILNAME,
                timetocomplete: `${String(trail.HOURS).padStart(2, '0')}:${String(trail.MINUTES).padStart(2, '0')}`, description: trail.DESCRIPTION, hazards: trail.HAZARDS, difficulty: trail.DIFFICULTY
            }
        });
    };

    return (
        <div className="trailwidget" onClick={handleTrailWidgetClick}>
            {preview && <img src={preview} alt="" />}
            <h1>{trail.TRAILNAME}</h1>
            <em>{trail.LOCATIONNAME}</em>
            <p>&nbsp;</p>
            <p>Time to Complete : <b>{`${String(trail.HOURS).padStart(2, '0')}:${String(trail.MINUTES).padStart(2, '0')}`}</b></p>
            <p>Difficulty : <b>{trail.DIFFICULTY}</b></p>
        </div>
    );
}

export default TrailWidget
