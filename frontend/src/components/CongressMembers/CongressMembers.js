import React, { useState, useEffect } from "react";
import useFetchMembers from "./hooks/useFetchMembers.js";
import MemberCard from "./MemberCard";

const CongressMembers = () => {
  const { members, loading, error } = useFetchMembers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading members: {error.message}</p>;

  return (
    <div>
      <h1>Congress Members</h1>
      <div className="members-list">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default CongressMembers;