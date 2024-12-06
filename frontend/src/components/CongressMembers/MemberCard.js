import React from "react";
import PropTypes from "prop-types";
import SliderBar from '../SliderBar';

const MemberCard = ({ member }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="text-gray-600">
            {member.state} - {member.chamber} ({member.party})
          </p>
          {member.next_election && (
            <p className="text-sm text-gray-500">
              Next Election: {member.next_election}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Political Leaning</p>
        <SliderBar 
          score={member.politicalScore || 50} 
          onChange={() => {}} 
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Left</span>
          <span>Right</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Policy Rating</p>
        <SliderBar 
          score={member.policyScore || 50} 
          onChange={() => {}} 
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-4 flex gap-2">
        {member.twitter_account && (
          <a href={`https://twitter.com/${member.twitter_account}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-500 hover:text-blue-700">
            Twitter
          </a>
        )}
        {member.facebook_account && (
          <a href={`https://facebook.com/${member.facebook_account}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-500 hover:text-blue-700">
            Facebook
          </a>
        )}
        {member.url && (
          <a href={member.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-500 hover:text-blue-700">
            Official Website
          </a>
        )}
      </div>
    </div>
  );
};

MemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    chamber: PropTypes.string.isRequired,
    party: PropTypes.string,
    url: PropTypes.string,
    next_election: PropTypes.string,
    twitter_account: PropTypes.string,
    facebook_account: PropTypes.string,
    politicalScore: PropTypes.number,
    policyScore: PropTypes.number,
  }).isRequired,
};

export default MemberCard;