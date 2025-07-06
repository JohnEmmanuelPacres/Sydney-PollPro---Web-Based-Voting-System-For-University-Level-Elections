import React from 'react';

export default function AFKWarningModal({ isOpen, remaining, onStay }: { isOpen: boolean, remaining: number, onStay: () => void }) {
  if (!isOpen) return null;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',padding:'2rem',borderRadius:'1rem',boxShadow:'0 2px 16px rgba(0,0,0,0.2)',textAlign:'center',minWidth:'300px'}}>
        <h2 style={{color:'#b91c1c',marginBottom:'1rem'}}>Inactivity Warning</h2>
        <p style={{color:'#222',fontSize:'1.5rem',fontWeight:'bold'}}>You will be logged out soon!</p>
        <p style={{color:'#222',fontSize:'1.2rem',margin:'1rem 0'}}>Time left: {mm}:{ss}</p>
        <button onClick={onStay} style={{marginTop:'1.5rem',padding:'0.5rem 1.5rem',background:'#b91c1c',color:'#fff',border:'none',borderRadius:'0.5rem',fontWeight:'bold',cursor:'pointer'}}>Stay Logged In</button>
      </div>
    </div>
  );
} 