'use strict';

const React             = require('react');
const useState          = React.useState;
const useEffect         = React.useEffect;
const useRef            = React.useRef;
const PropTypes         = require('prop-types');
const classNames        = require('classnames');
const TransitionGroup   = require('react-transition-group/TransitionGroup');
const CSSTransition     = require('react-transition-group/CSSTransition');
const moment            = require('moment');
const momentFormat      = require('moment-duration-format');


const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const ConferenceHeader = (props) => {
    let [seconds, setSeconds] = useState(0);

    useInterval(() => {
        setSeconds(seconds + 1);
    }, 1000);

    const duration = moment.duration(seconds, 'seconds').format('hh:mm:ss', {trim: false});

    let videoHeader;
    let callButtons;

    if (props.show) {
        const participantCount = props.participants.length + 1;
        const callDetail = (
            <span>
                <i className="fa fa-clock-o"></i> {duration}
                &nbsp;&mdash;&nbsp;
                <i className="fa fa-users"></i> {participantCount} participant{participantCount > 1 ? 's' : ''}
            </span>
        );

        let electron = false;
        if (typeof window.process !== 'undefined') {
            if (window.process.versions.electron !== '' && window.process.platform === 'darwin') {
                electron = true;
            }
        }

        const leftButtonClasses = classNames({
            'conference-top-left-buttons': true,
            'electron-margin': electron
        });

        videoHeader = (
            <CSSTransition
                key="header"
                classNames="videoheader"
                timeout={{ enter: 300, exit: 300}}
            >
                <div key="header" className="call-header">
                    <div className="container-fluid">
                        <div className={leftButtonClasses}>
                            {props.buttons.top.left}
                        </div>
                        <p className="lead"><strong>Conference:</strong> {props.remoteIdentity}</p>
                        <p className="lead">{callDetail}</p>
                        <div className="conference-top-buttons">
                            {props.buttons.top.right}
                        </div>

                    </div>
                </div>
            </CSSTransition>
        );

        callButtons = (
            <CSSTransition
                key="header2"
                classNames="videoheader"
                timeout={{ enter: 300, exit: 300}}
            >
            <div className="conference-buttons">
                {props.buttons.bottom}
            </div>
            </CSSTransition>
        );
    }

    return (
        <div className="top-overlay">
            <TransitionGroup>
                {videoHeader}
                {callButtons}
            </TransitionGroup>
        </div>
    );
}

ConferenceHeader.propTypes = {
    show: PropTypes.bool.isRequired,
    remoteIdentity: PropTypes.string.isRequired,
    participants: PropTypes.array.isRequired,
    buttons: PropTypes.object.isRequired
};


module.exports = ConferenceHeader;
