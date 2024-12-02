import React from 'react';
import Profile from './Profile';

const profiles = [
  { name: 'Bernie Sanders', votingScore: 85 },
  { name: 'Ted Cruz', votingScore: 15 },
];

const DynamicProfiles = () => {
  return (
    <div>
      {profiles.map((profile, index) => (
        <Profile key={index} name={profile.name} votingScore={profile.votingScore} />
      ))}
    </div>
  );
};

export default DynamicProfiles;