import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const InfoModal = ({ isOpen, onClose, region, mapMode }) => {
  if (!isOpen || !region) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-black/50 backdrop-blur-lg text-white border-2 border-cyan-500 rounded-xl shadow-lg shadow-cyan-500/30 p-6 w-full max-w-md mx-auto relative"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()} // prevent closing on inner click
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-cyan-300 hover:text-white bg-gray-800/30 border border-cyan-400/50 rounded-full w-8 h-8 flex items-center justify-center transition-all"
            aria-label="Close Modal"
          >
            ✕
          </button>

          {/* Modal Title */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-cyan-300">
              {mapMode === "district" ? "District Information" : "State Information"}
            </h2>
          </div>

          {/* Info Table */}
          <table className="w-full text-sm text-white text-center table-auto border-separate border-spacing-y-2">
            <tbody>
              {region.state && (
                <tr>
                  <td className="text-gray-400">State</td>
                  <td className="font-medium">{region.state}</td>
                </tr>
              )}

              {region.district && (
                <tr>
                  <td className="text-gray-400">
                    {mapMode === "state" ? "Districts" : "District"}
                  </td>
                  <td className="font-medium">{region.district}</td>
                </tr>
              )}

              {mapMode === "state" && region.districtCount && (
                <tr>
                  <td className="text-gray-400">District Count</td>
                  <td className="font-medium">{region.districtCount}</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoModal;
