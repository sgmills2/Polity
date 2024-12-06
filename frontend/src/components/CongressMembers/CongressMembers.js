import React from "react";
import useFetchMembers from "./hooks/useFetchMembers.js";
import MemberCard from "./MemberCard";

const CongressMembers = ({ chamber, state }) => {
  const { members, loading, error } = useFetchMembers(chamber, state);

  if (!chamber || !state) return null;
  if (loading) return <p className="text-center py-4">Loading members...</p>;
  if (error) {
    console.error("Error loading members:", error);
    return <p className="text-center py-4 text-red-600">Error loading members: {error.message}</p>;
  }

  if (members.length === 0) {
    return <p className="text-center py-4">No members found for {state} {chamber}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {chamber.charAt(0).toUpperCase() + chamber.slice(1)} Members - {state}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default CongressMembers;