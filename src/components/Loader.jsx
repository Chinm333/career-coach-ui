import React from "react";

export default function Loader() {
    return (
        <div className="w-full flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
    );
}
