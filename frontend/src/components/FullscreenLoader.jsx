import React from 'react';

export default function FullscreenLoader({
  isInitialLoad,
  visibleLines,
  currentLineIdx,
  typedText,
  loadingMessagesLength,
}) {
  if (!isInitialLoad) return null;

  return (
    <div className="fullscreen-loader-overlay select-none" id="fullscreen-loader">
      <div className="loader"></div>
      <div className="loader-messages-container">
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-default)', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '16px' }}>
          This loader is here — Because Render is slow
        </div>
        {visibleLines.map((line, idx) => (
          <div key={idx} className="mono" style={{ color: 'var(--fg-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>// {line}</div>
        ))}
        {currentLineIdx < loadingMessagesLength && (
          <div className="mono" style={{ color: 'var(--fg-default)', fontWeight: 'var(--weight-semibold)' }}>
            &gt; {typedText}
            <span className="loader-cursor"></span>
          </div>
        )}
      </div>
    </div>
  );
}
