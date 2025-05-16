import React from 'react';
import "./styles.css"

export const RenderAvatar = ({ avatar, subject }) => {
    if (avatar) {
        return <img src={avatar} alt={subject} className="avatarImage" />;
    }
    const letter = subject.charAt(0).toUpperCase();
    return <div className="avatarFallback">{letter}</div>;
};

const ClassroomListElement = ({ classroom }) => {
    const { subject, name } = classroom;

    return (
        <div className="container">
            <div className="textContainer">
                <div className="subject">{subject}</div>
                <div className="instructor">{name}</div>
            </div>
        </div>
    );
};

export default ClassroomListElement;
