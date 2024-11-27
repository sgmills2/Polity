import React from "react";
import PropTypes from "prop-types";

const MemberCard = ({ member }) => {
  return (
    <div className="member-card">
      <img src={member.image} alt={`${member.name}`} />
      <h2>{member.name}</h2>
      <p>
        {member.party} - {member.state}
      </p>
      <a href={member.profile_url} target="_blank" rel="noopener noreferrer">
        View Profile
      </a>
    </div>
  );
};

MemberCard.propTypes = {
  member: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    party: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    profile_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default MemberCard;