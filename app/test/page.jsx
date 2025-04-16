import React from 'react';

export default function TestPage() {
  return (
    <div>
      <h1>Material Icons Test</h1>

      {/* Material Icons Section */}
      <h3>Notifications Icon:</h3>
      <span className="material-symbols-outlined">notifications</span>

      <h3>Forum Icon:</h3>
      <span className="material-symbols-outlined">forum</span>

      <h3>Send Icon:</h3>
      <span className="material-symbols-outlined">send</span>

      <h3>Favorite Icon:</h3>
      <span className="material-symbols-outlined">favorite</span>

      <h3>Add Comment Icon:</h3>
      <span className="material-symbols-outlined">add_comment</span>

      {/* Noto Sans Symbols 2 Section */}
      <h3>Font: Noto Sans Symbols 2</h3>
      <span className="noto-sans-symbols-2-regular">🨄</span>
      <br />
      <span className="noto-sans-symbols-2-regular">🚲</span>
      <br />
      <span className="noto-sans-symbols-2-regular">✋</span>
      <br />
      <span className="noto-sans-symbols-2-regular">👍</span>
      <br />
      <span className="noto-sans-symbols-2-regular">♠</span>
    </div>
  );
}
