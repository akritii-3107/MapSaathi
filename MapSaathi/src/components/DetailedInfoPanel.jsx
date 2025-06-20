const DetailedInfoPanel = ({ region }) => {
  if (!region) {
    return (
      <div className="text-neutral-400 italic">
        Click a district to see details
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-black/40 border border-white/10 text-white p-6 w-96 rounded-xl shadow-lg mt-6">
      {region ? (
        <>
          <h2 className="text-xl font-semibold mb-2">{region.district}</h2>
          <p className="text-sm text-gray-300 mb-1">
            <strong>State:</strong> {region.state}
          </p>
          <p className="text-sm text-gray-300 mb-1">
            <strong>State Code:</strong> {region.code}
          </p>
          <p className="text-sm text-gray-300">
            <strong>Year:</strong> {region.year}
          </p>
        </>
      ) : (
        <p className="text-gray-400">Click a district to view info</p>
      )}
    </div>
  );
};

export default DetailedInfoPanel;

