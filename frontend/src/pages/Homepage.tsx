import React from 'react';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold">Welcome to Gamerz</h1>
        <p className="mt-4 text-lg">Find teammates and chat in real time!</p>
        <button className="btn btn-primary mt-6"> Start Now!</button>
      </div>
    </div>
  );
};

export default Homepage;
