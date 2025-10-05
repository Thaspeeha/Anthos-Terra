import Image from "next/image";

const RightPanel = () => {
  const rightPanelStyle: React.CSSProperties = {
    width: '300px',
    background: '#fff',
    padding: '24px 16px',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    margin: '24px 24px 24px 0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 48px)',
  };

  const h3Style: React.CSSProperties = {
    marginBottom: '16px',
    color: '#6c8a72',
  };

  const suggestionStyle: React.CSSProperties = {
    marginBottom: '18px',
    textAlign: 'center',
  };

  const suggestionImgStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '6px',
  };

  const suggestionTextStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#2f4f2f',
  };

  const tipsH3Style: React.CSSProperties = {
    color: '#2f6c2f',
    fontSize: '1rem',
    marginBottom: '8px',
  };

  const tipsOlStyle: React.CSSProperties = {
    listStyleType: 'decimal',
    fontSize: '0.95rem',
    marginLeft: '18px',
    color: '#2f4f2f',
  };

  const hrStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    margin: '16px 0',
  };

  return (
    <aside style={rightPanelStyle}>
      <h3 style={h3Style}>You may be looking for</h3>
      <div style={suggestionStyle}>
        <Image
          src="/detect/BlueAgava.png"
          alt="Blue Agava"
          width={200}
          height={150}
          style={suggestionImgStyle}
        />
        <div style={suggestionTextStyle}>Blue Agava</div>
      </div>
      <div style={suggestionStyle}>
        <Image
          src="/detect/Gasteria.png"
          alt="Gasteria"
          width={200}
          height={150}
          style={suggestionImgStyle}
        />
        <div style={suggestionTextStyle}>Gasteria</div>
      </div>
      <hr style={hrStyle} />
      <div>
        <h3 style={tipsH3Style}>Tips for better detection</h3>
        <ol style={tipsOlStyle}>
          <li>Use Natural Light – Take the photo in daylight</li>
          <li>Keep it Clear – Avoid blurry photos by holding your phone steady.</li>
          <li>Fill the Frame – Make sure the plant is the main subject, not too far away.</li>
        </ol>
      </div>
    </aside>
  );
};

export default RightPanel;
