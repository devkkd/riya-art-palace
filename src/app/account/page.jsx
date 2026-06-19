"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import ValuesSection from "../components/ValuesSection.jsx";
import FollowUs from "../components/FollowUs";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

function AddAddressForm({ onCancel, onSave }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName:"",lastName:"",line1:"",line2:"",city:"",state:"",
    pincode:"",country:"India",phone:"",altPhone:"",isDefault:false
  });
  const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));
  return (
    <div>
      <button style={{background:"none",border:"none",fontSize:13,color:"#F85700",cursor:"pointer",fontFamily:"Manrope,sans-serif",fontWeight:600,marginBottom:20,padding:0}} onClick={onCancel}>
        ← Back to addresses
      </button>
      <div style={{fontFamily:"Manrope,sans-serif",fontSize:20,fontWeight:800,marginBottom:24,color:"#0E0E0E"}}>Add New Address</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {[["firstName","First Name"],["lastName","Last Name"],["line1","Address Line 1"],
          ["line2","Address Line 2"],["city","City"],["pincode","Pincode"],
          ["state","State"],["country","Country"],["phone","Phone"],["altPhone","Alternate Phone"]
        ].map(([k,label])=>(
          <div key={k} style={{display:"flex",flexDirection:"column",gap:6,gridColumn:["line1","line2"].includes(k)?"span 2":"auto"}}>
            <label style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}</label>
            <input style={{height:46,border:"1.5px solid #C3BCB4",borderRadius:10,padding:"0 14px",fontSize:14,background:"#FAF8F6",outline:"none",width:"100%",fontFamily:"Poppins,sans-serif"}}
              placeholder={label} value={form[k]} onChange={set(k)}/>
          </div>
        ))}
      </div>
      <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,fontSize:14,cursor:"pointer"}}>
        <input type="checkbox" checked={form.isDefault} onChange={e=>setForm(f=>({...f,isDefault:e.target.checked}))} style={{accentColor:"#F85700",width:16,height:16}}/>
        Set as default address
      </label>
      <button disabled={saving} onClick={async()=>{setSaving(true);await onSave(form);setSaving(false);}}
        style={{height:50,padding:"0 36px",border:"none",borderRadius:999,background:saving?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>
        {saving?"Saving...":"Save Address"}
      </button>
    </div>
  );
}

export default function AccountPage() {
  const [user,setUser]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [step,setStep]=useState("phone");
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState("");
  const [sessionToken,setSessionToken]=useState("");
  const [sending,setSending]=useState(false);
  const [verifying,setVerifying]=useState(false);
  const [loginError,setLoginError]=useState("");
  const [activeTab,setActiveTab]=useState("orders");
  const [orders,setOrders]=useState([]);
  const [ordersLoading,setOrdersLoading]=useState(false);
  const [showAddForm,setShowAddForm]=useState(false);

  useEffect(()=>{
    fetch("/api/auth/user/me").then(r=>r.json()).then(j=>{if(j.success)setUser(j.data.user);}).catch(()=>{}).finally(()=>setAuthLoading(false));
  },[]);

  useEffect(()=>{
    if(user&&activeTab==="orders"){
      setOrdersLoading(true);
      fetch("/api/orders/my").then(r=>r.json()).then(j=>{if(j.success)setOrders(j.data);}).catch(()=>{}).finally(()=>setOrdersLoading(false));
    }
  },[user,activeTab]);

  const handleSendOtp=async()=>{
    setLoginError("");
    const cleaned=phone.replace(/\D/g,"");
    if(cleaned.length!==10){setLoginError("Please enter a valid 10-digit mobile number");return;}
    setSending(true);
    try{
      const res=await fetch("/api/auth/user/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:cleaned})});
      const json=await res.json();
      if(json.success){setSessionToken(json.data.session_token);setStep("otp");}
      else setLoginError(json.message||"Failed to send OTP. Please try again.");
    }catch{setLoginError("Network error. Please try again.");}
    finally{setSending(false);}
  };

  const handleVerifyOtp=async()=>{
    setLoginError("");
    if(!otp||otp.length<4){setLoginError("Please enter the OTP");return;}
    setVerifying(true);
    try{
      const res=await fetch("/api/auth/user/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:phone.replace(/\D/g,""),otp,session_token:sessionToken})});
      const json=await res.json();
      if(json.success){setUser(json.data.user);setStep("phone");setOtp("");}
      else setLoginError(json.message||"Invalid OTP. Please try again.");
    }catch{setLoginError("Network error. Please try again.");}
    finally{setVerifying(false);}
  };

  const handleLogout=async()=>{
    await fetch("/api/auth/user/logout",{method:"POST"});
    setUser(null);setOrders([]);setStep("phone");setPhone("");setOtp("");
  };

  const fmtDate=(d)=>d?new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"";
  const STATUS_COLOR={
    pending:{bg:"#FEF3C7",color:"#92400E"},confirmed:{bg:"#DBEAFE",color:"#1E40AF"},
    processing:{bg:"#EDE9FE",color:"#5B21B6"},shipped:{bg:"#D1FAE5",color:"#065F46"},
    out_for_delivery:{bg:"#A7F3D0",color:"#064E3B"},delivered:{bg:"#BBF7D0",color:"#14532D"},
    cancelled:{bg:"#FEE2E2",color:"#991B1B"},
  };

  if(authLoading)return(<><Navbar/><div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F5F3"}}><div style={{width:32,height:32,border:"3px solid #E5DDD5",borderTopColor:"#F85700",borderRadius:"50%",animation:"adm-spin 0.7s linear infinite"}}/></div><Footer/></>);

  return (
    <>
      <Navbar/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes acSpin{to{transform:rotate(360deg)}}
        @keyframes acModal{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1)translateY(0)}}
        .ac-page{background:#F7F5F3;min-height:100vh;font-family:'Poppins',sans-serif}
        .ac-container{max-width:1100px;margin:0 auto;padding:0 40px 80px}
        .login-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
        .login-modal{background:#fff;border-radius:16px;width:100%;max-width:440px;padding:40px 36px 36px;box-shadow:0 24px 60px rgba(0,0,0,0.18);animation:acModal .25s ease}
        .ac-header{display:flex;align-items:center;justify-content:space-between;padding:32px 0 28px;border-bottom:1px solid #E0D9D1;margin-bottom:32px}
        .ac-header-title{font-family:'Manrope',sans-serif;font-size:26px;font-weight:800;color:#0E0E0E;letter-spacing:-0.02em}
        .ac-logout-btn{display:flex;align-items:center;gap:6px;background:none;border:1.5px solid #C3BCB4;border-radius:999px;padding:8px 20px;font-size:13px;font-weight:600;color:#555;cursor:pointer;font-family:'Poppins',sans-serif}
        .ac-logout-btn:hover{border-color:#F85700;color:#F85700}
        .ac-tabs{display:flex;gap:4px;margin-bottom:32px;border-bottom:1px solid #E0D9D1}
        .ac-tab{padding:12px 20px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:600;color:#888;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;margin-bottom:-1px}
        .ac-tab:hover{color:#F85700}
        .ac-tab.active{color:#F85700;border-bottom-color:#F85700}
        .ac-section-title{font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#0E0E0E;margin-bottom:20px}
        .ac-empty{font-family:'Manrope',sans-serif;font-size:14px;color:#888;padding:12px 0}
        .ac-detail-row{display:flex;align-items:center;padding:18px 0;border-bottom:1px solid #EDE8E3}
        .ac-detail-row:last-child{border-bottom:none}
        .ac-detail-label{font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;color:#0E0E0E;min-width:160px}
        .ac-detail-value{font-family:'Manrope',sans-serif;font-size:14px;color:#555;flex:1}
        .order-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:12px;padding:20px 24px;margin-bottom:16px}
        .order-track-btn{height:36px;padding:0 18px;border:1.5px solid #F85700;border-radius:999px;background:#fff;color:#F85700;font-size:12px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;font-family:'Poppins',sans-serif}
        .order-track-btn:hover{background:#F85700;color:#fff}
        .ac-add-btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border:none;border-radius:999px;background:#F85700;color:#fff;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:24px;font-family:'Poppins',sans-serif}
        .ac-address-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:12px;padding:20px 24px;margin-bottom:16px}
        .ac-remove-btn{height:36px;padding:0 18px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #e53e3e;color:#e53e3e;font-family:'Poppins',sans-serif}
        .ac-remove-btn:hover{background:#e53e3e;color:#fff}
        @media(max-width:768px){.ac-container{padding:0 16px 60px}.login-modal{padding:28px 20px 24px}}
      `}</style>

      {!user&&(
        <div className="login-overlay">
          <div className="login-modal">
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <Image src={logo} alt="Riya Art Palace" width={130} height={44} style={{height:44,width:"auto",objectFit:"contain"}} priority/>
            </div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:22,fontWeight:800,color:"#0E0E0E",marginBottom:4}}>Riya Art Palace</div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#888",marginBottom:28}}>Sign in to your account</div>

            {step==="phone"?(
              <>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700,color:"#444",marginBottom:8}}>Mobile Number</div>
                <div style={{display:"flex",gap:8,marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,height:50,border:"1.5px solid #C3BCB4",borderRadius:10,padding:"0 14px",background:"#FAF8F6",fontSize:14,fontWeight:600,color:"#333",flexShrink:0}}>
                    IN +91
                  </div>
                  <input type="tel" maxLength={10}
                    style={{flex:1,height:50,border:"1.5px solid "+(loginError?"#e53e3e":"#C3BCB4"),borderRadius:10,padding:"0 16px",fontSize:15,color:"#333",outline:"none",background:"#FAF8F6",width:"100%"}}
                    placeholder="10-digit mobile number" value={phone}
                    onChange={e=>{setPhone(e.target.value.replace(/\D/g,""));setLoginError("");}}
                    onKeyDown={e=>e.key==="Enter"&&handleSendOtp()} autoFocus/>
                </div>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:12}}>{loginError}</div>}
                <button onClick={handleSendOtp} disabled={sending}
                  style={{width:"100%",height:52,border:"none",borderRadius:999,background:sending?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif",marginTop:8}}>
                  {sending?"Sending OTP...":"Login →"}
                </button>
              </>
            ):(
              <>
                <button onClick={()=>{setStep("phone");setOtp("");setLoginError("");}}
                  style={{background:"none",border:"none",fontSize:13,color:"#F85700",cursor:"pointer",fontWeight:600,marginBottom:16,padding:0,fontFamily:"Manrope,sans-serif"}}>
                  ← Change number (+91 {phone})
                </button>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700,color:"#444",marginBottom:8}}>Enter OTP</div>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#888",marginBottom:14}}>
                  OTP sent to +91 {phone}
                </div>
                <input type="tel" maxLength={6}
                  style={{height:56,border:"1.5px solid "+(loginError?"#e53e3e":"#C3BCB4"),borderRadius:10,padding:"0 16px",fontSize:28,color:"#333",outline:"none",background:"#FAF8F6",width:"100%",textAlign:"center",letterSpacing:12,marginBottom:6}}
                  placeholder="----" value={otp}
                  onChange={e=>{setOtp(e.target.value.replace(/\D/g,""));setLoginError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleVerifyOtp()} autoFocus/>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:12}}>{loginError}</div>}
                <button onClick={handleVerifyOtp} disabled={verifying}
                  style={{width:"100%",height:52,border:"none",borderRadius:999,background:verifying?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif",marginTop:8}}>
                  {verifying?"Verifying...":"Verify OTP →"}
                </button>
              </>
            )}
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:11,color:"#AAA",marginTop:16,lineHeight:1.6}}>
              By continuing, you agree to our{" "}
              <a href="/privacy-policy" style={{color:"#F85700",textDecoration:"none"}}>Privacy Policy</a>{" "}&amp;{" "}
              <a href="/terms" style={{color:"#F85700",textDecoration:"none"}}>Terms of Service</a>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:14,fontFamily:"Manrope,sans-serif",fontSize:11,color:"#BBB"}}>
              <span>POWERED BY</span><strong style={{color:"#444"}}>Shiprocket</strong>
            </div>
          </div>
        </div>
      )}

      <div className="ac-page">
        <div className="ac-container">
          <div className="ac-header">
            <div className="ac-header-title">My Account</div>
            <button className="ac-logout-btn" onClick={handleLogout}>Log out</button>
          </div>

          {showAddForm?(
            <AddAddressForm onCancel={()=>setShowAddForm(false)} onSave={async(form)=>{
              const res=await fetch("/api/auth/user/addresses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
              const j=await res.json();
              if(j.success)setUser(prev=>({...prev,addresses:j.data.addresses}));
              setShowAddForm(false);
            }}/>
          ):(
            <>
              <div className="ac-tabs">
                {[["orders","Order History"],["details","Account Details"],["addresses","Addresses"]].map(([key,label])=>(
                  <button key={key} className={"ac-tab"+(activeTab===key?" active":"")} onClick={()=>setActiveTab(key)}>{label}</button>
                ))}
              </div>

              {activeTab==="orders"&&(
                <div>
                  <div className="ac-section-title">Order History</div>
                  {ordersLoading?(
                    <div style={{display:"flex",justifyContent:"center",padding:32}}>
                      <div style={{width:28,height:28,border:"3px solid #E5DDD5",borderTopColor:"#F85700",borderRadius:"50%",animation:"acSpin 0.7s linear infinite"}}/>
                    </div>
                  ):orders.length===0?(
                    <div className="ac-empty">You haven't placed any orders yet.</div>
                  ):orders.map(order=>{
                    const sc=STATUS_COLOR[order.orderStatus]||{bg:"#F3F4F6",color:"#374151"};
                    return(
                      <div key={order.id} className="order-card">
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                          <div>
                            <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#0E0E0E"}}>{order.orderId}</div>
                            <div style={{fontSize:12,color:"#888",marginTop:2}}>{fmtDate(order.createdAt)}</div>
                          </div>
                          <span style={{padding:"4px 12px",borderRadius:999,fontSize:12,fontWeight:700,background:sc.bg,color:sc.color}}>
                            {order.orderStatus?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                          </span>
                        </div>
                        <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#555",marginBottom:8}}>
                          {order.items?.slice(0,2).map(i=>i.productName).join(", ")}
                          {order.items?.length>2?(" +" + (order.items.length-2) + " more"):""}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                          <div style={{fontFamily:"Manrope,sans-serif",fontSize:15,fontWeight:800,color:"#0E0E0E"}}>
                            Rs.{order.totalAmount} &middot; {order.paymentMethod}
                          </div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            {order.awbNumber&&<span style={{fontSize:12,color:"#888"}}>AWB: {order.awbNumber}</span>}
                            {order.trackingUrl&&<a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="order-track-btn">Track Order</a>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab==="details"&&(
                <div>
                  <div className="ac-section-title">Account Details</div>
                  {[["Phone","+91 "+(user?.phone||"")],["Name",user?.name||"—"],["Email",user?.email||"—"]].map(([label,value])=>(
                    <div key={label} className="ac-detail-row">
                      <div className="ac-detail-label">{label}</div>
                      <div className="ac-detail-value">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab==="addresses"&&(
                <div>
                  <div className="ac-section-title">Your Addresses</div>
                  <button className="ac-add-btn" onClick={()=>setShowAddForm(true)}>+ Add New Address</button>
                  {(!user?.addresses||user.addresses.length===0)?(
                    <div className="ac-empty">No addresses saved yet.</div>
                  ):user.addresses.map(addr=>(
                    <div key={addr._id} className="ac-address-card">
                      <div style={{fontFamily:"Manrope,sans-serif",fontSize:15,fontWeight:800,color:"#0E0E0E",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                        {addr.firstName} {addr.lastName}
                        {addr.isDefault&&<span style={{fontSize:11,fontWeight:700,background:"#F85700",color:"#fff",padding:"2px 10px",borderRadius:999}}>Default</span>}
                      </div>
                      <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#666",lineHeight:1.7,marginBottom:14}}>
                        {addr.line1}{addr.line2?", "+addr.line2:""}<br/>
                        {addr.city}, {addr.state} - {addr.pincode}<br/>
                        {addr.country}<br/>
                        {addr.phone}
                      </div>
                      <button className="ac-remove-btn" onClick={async()=>{
                        const res=await fetch("/api/auth/user/addresses/"+addr._id,{method:"DELETE"});
                        const j=await res.json();
                        if(j.success)setUser(prev=>({...prev,addresses:j.data.addresses}));
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ValuesSection/>
      <FollowUs/>
      <Footer/>
    </>
  );
}
