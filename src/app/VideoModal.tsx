import React, { useState } from "react";

const VideoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const videoUrl =
    "https://drive.google.com/file/d/14shVsCStb3lTsXAhB-J-dIJO4eZezc3Q/preview";

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Watch Demo
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={videoUrl}
              title="Demo Video"
              width="640"
              height="360"
              allow="autoplay"
              allowFullScreen
              className="block"
            ></iframe>
            <div className="p-2 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoModal;
