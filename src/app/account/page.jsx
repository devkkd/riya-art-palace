"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import ValuesSection from "../components/ValuesSection.jsx";
import FollowUs from "../components/FollowUs";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { useUser } from "../components/UserContext";

/* ── Add Address Form ───────────────────────────────────── */
function AddAddressForm({ onCancel, onSave }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName:"",lastName:"",line1:"",line2:"",city:"",state:"",
    pincode:"",country:"India",phone:"",altPhone:"",isDefault:false
  });
  const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));
  const inp={height:46,border:"1.5px solid #C3BCB4",borderRadius:10,padding:"0 14px",fontSize:14,background:"#FAF8F6",outline:"none",width:"100%",fontFamily:"Poppins,sans-serif"};
  return (
    <div>
      <button style={{background:"none",border:"none",fontSize:13,color:"#F85700",cursor:"pointer",fontFamily:"Manrope,sans-serif",fontWeight:600,marginBottom:20,padding:0}} onClick={onCancel}>← Back to addresses</button>
      <div style={{fontFamily:"Manrope,sans-serif",fontSize:20,fontWeight:800,marginBottom:24,color:"#0E0E0E"}}>Add New Address</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {[["firstName","First Name"],["lastName","Last Name"],["line1","Address Line 1"],["line2","Address Line 2"],["city","City"],["pincode","Pincode"],["state","State"],["country","Country"],["phone","Phone"],["altPhone","Alternate Phone"]].map(([k,label])=>(
          <div key={k} style={{display:"flex",flexDirection:"column",gap:6,gridColumn:["line1","line2"].includes(k)?"span 2":"auto"}}>
            <label style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}</label>
            <input style={inp} placeholder={label} value={form[k]} onChange={set(k)}/>
          </div>
        ))}
      </div>
      <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,fontSize:14,cursor:"pointer"}}>
        <input type="checkbox" checked={form.isDefault} onChange={e=>setForm(f=>({...f,isDefault:e.target.checked}))} style={{accentColor:"#F85700",width:16,height:16}}/>
        Set as default address
      </label>
      <button disabled={saving} onClick={async()=>{setSaving(true);await onSave(form);setSaving(false);}} style={{height:50,padding:"0 36px",border:"none",borderRadius:999,background:saving?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>
        {saving?"Saving...":"Save Address"}
      </button>
    </div>
  );
}

/* ── Review Modal ───────────────────────────────────────── */
function ReviewModal({ order, onClose }) {
  const items = order.items || [];
  const [selIdx,setSelIdx]=useState(0);
  const [rating,setRating]=useState(0);
  const [hover,setHover]=useState(0);
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [success,setSuccess]=useState(false);
  const [error,setError]=useState("");
  const selProduct=items[selIdx];
  const LABELS=["","Poor","Fair","Good","Very Good","Excellent"];
  const inp={height:44,border:"1.5px solid #C3BCB4",borderRadius:10,padding:"0 14px",fontSize:14,background:"#FAF8F6",outline:"none",width:"100%",fontFamily:"Poppins,sans-serif",color:"#0E0E0E"};

  const submit=async()=>{
    if(!selProduct){setError("No product selected");return;}
    if(rating===0){setError("Please select a rating");return;}
    setError("");setSubmitting(true);
    try{
      const res=await fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:selProduct.productId?.toString(),orderId:order.id||order._id,rating,title:title.trim(),body:body.trim()})});
      const json=await res.json();
      if(json.success)setSuccess(true);
      else setError(json.message||"Failed to submit review");
    }catch{setError("Network error. Please try again.");}
    finally{setSubmitting(false);}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:520,padding:"32px 28px",boxShadow:"0 24px 60px rgba(0,0,0,0.2)",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontFamily:"Manrope,sans-serif",fontSize:20,fontWeight:800,color:"#0E0E0E"}}>Write a Review</div>
          <button onClick={onClose} style={{background:"#F0EDE9",border:"none",width:32,height:32,borderRadius:"50%",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}>✕</button>
        </div>
        {success?(
          <div style={{textAlign:"center",padding:"20px 0 8px"}}>
            <div style={{fontSize:56,marginBottom:14}}>🎉</div>
            <div style={{fontFamily:"Manrope,sans-serif",fontWeight:800,fontSize:18,color:"#0E0E0E",marginBottom:8}}>Thank you for your review!</div>
            <div style={{fontFamily:"Manrope,sans-serif",fontSize:14,color:"#888",marginBottom:24}}>Your feedback helps other customers make better decisions.</div>
            <button onClick={onClose} style={{height:48,padding:"0 32px",border:"none",borderRadius:999,background:"#F85700",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>Done</button>
          </div>
        ):(
          <>
            {items.length>1&&(
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Select Product</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {items.map((item,idx)=>(
                    <div key={idx} onClick={()=>setSelIdx(idx)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:`1.5px solid ${selIdx===idx?"#F85700":"#E0D9D1"}`,borderRadius:12,cursor:"pointer",background:selIdx===idx?"#FFF9F6":"#fff"}}>
                      {item.image?<img src={item.image} alt={item.productName} style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:44,height:44,borderRadius:8,background:"#F0EDE9",flexShrink:0}}/>}
                      <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700}}>{item.productName}</div>
                      {selIdx===idx&&<span style={{marginLeft:"auto",color:"#F85700",fontSize:18}}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {items.length===1&&selProduct&&(
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#F7F5F3",borderRadius:12,marginBottom:20}}>
                {selProduct.image?<img src={selProduct.image} alt={selProduct.productName} style={{width:48,height:48,borderRadius:8,objectFit:"cover",flexShrink:0}}/>:<div style={{width:48,height:48,borderRadius:8,background:"#E0D9D1",flexShrink:0}}/>}
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700}}>{selProduct.productName}</div>
              </div>
            )}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Your Rating *</div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                {[1,2,3,4,5].map(star=>(
                  <button key={star} type="button" onMouseEnter={()=>setHover(star)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(star)}
                    style={{fontSize:38,background:"none",border:"none",cursor:"pointer",color:star<=(hover||rating)?"#F85700":"#E0D9D1",lineHeight:1,padding:"0 2px",transition:"color .1s,transform .1s",transform:star<=(hover||rating)?"scale(1.15)":"scale(1)"}}>★</button>
                ))}
                {(hover||rating)>0&&<span style={{marginLeft:10,fontFamily:"Manrope,sans-serif",fontSize:14,fontWeight:700,color:"#F85700"}}>{LABELS[hover||rating]}</span>}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:8}}>Review Title</label>
              <input style={inp} placeholder="e.g. Great quality product!" value={title} onChange={e=>setTitle(e.target.value)} maxLength={100}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:8}}>Your Review</label>
              <textarea style={{...inp,height:110,padding:"12px 14px",resize:"vertical",lineHeight:1.7}} placeholder="Tell others about your experience…" value={body} onChange={e=>setBody(e.target.value)} maxLength={1000}/>
              <div style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:"#bbb",textAlign:"right",marginTop:4}}>{body.length}/1000</div>
            </div>
            {error&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:10,padding:"10px 14px",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#991B1B",marginBottom:16}}>{error}</div>}
            <button onClick={submit} disabled={submitting||rating===0} style={{width:"100%",height:50,border:"none",borderRadius:999,background:(submitting||rating===0)?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:700,cursor:(submitting||rating===0)?"not-allowed":"pointer",fontFamily:"Poppins,sans-serif"}}>
              {submitting?"Submitting…":"Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Account Details Tab ────────────────────────────────── */
function AccountDetailsTab({ user, onUpdate }) {
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState(user?.name||"");
  const [phone,setPhone]=useState(user?.phone||"");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const fieldStyle={height:46,border:"1.5px solid #C3BCB4",borderRadius:10,padding:"0 14px",fontSize:14,background:"#FAF8F6",outline:"none",width:"100%",fontFamily:"Poppins,sans-serif",color:"#0E0E0E"};

  const handleSave=async()=>{
    setError("");setSuccess("");
    const trimName=name.trim();
    const trimPhone=phone.replace(/\D/g,"");
    if(!trimName){setError("Name cannot be empty");return;}
    if(trimPhone&&trimPhone.length!==10){setError("Enter a valid 10-digit mobile number");return;}
    setSaving(true);
    try{
      const res=await fetch("/api/auth/user/me",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:trimName,phone:trimPhone})});
      const json=await res.json();
      if(json.success){onUpdate({name:json.data.user.name,phone:json.data.user.phone});setSuccess("Profile updated successfully");setEditing(false);setTimeout(()=>setSuccess(""),3000);}
      else setError(json.message||"Update failed");
    }catch{setError("Network error. Please try again.");}
    finally{setSaving(false);}
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{fontFamily:"Manrope,sans-serif",fontSize:18,fontWeight:800,color:"#0E0E0E"}}>Account Details</div>
        {!editing&&<button onClick={()=>{setEditing(true);setError("");setSuccess("");}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"1.5px solid #C3BCB4",borderRadius:999,padding:"8px 20px",fontSize:13,fontWeight:600,color:"#555",cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>✏️ Edit Profile</button>}
      </div>
      {success&&<div style={{background:"#D1FAE5",border:"1px solid #6EE7B7",borderRadius:10,padding:"10px 16px",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#065F46",marginBottom:20}}>✓ {success}</div>}
      {error&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:10,padding:"10px 16px",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#991B1B",marginBottom:20}}>{error}</div>}
      {editing?(
        <div style={{background:"#fff",border:"1.5px solid #E0D9D1",borderRadius:14,padding:"28px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"Manrope,sans-serif"}}>Full Name *</label>
              <input style={fieldStyle} placeholder="Enter your full name" value={name} onChange={e=>setName(e.target.value)} autoFocus/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"Manrope,sans-serif"}}>Mobile Number</label>
              <input style={fieldStyle} type="tel" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,gridColumn:"span 2"}}>
              <label style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"Manrope,sans-serif"}}>Email Address <span style={{fontSize:10,color:"#aaa",fontWeight:400,textTransform:"none"}}>(login ID — cannot be changed)</span></label>
              <input style={{...fieldStyle,background:"#F0EDE9",color:"#888",cursor:"not-allowed"}} value={user?.email||""} disabled/>
            </div>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={handleSave} disabled={saving} style={{height:46,padding:"0 32px",border:"none",borderRadius:999,background:saving?"#ccc":"#F85700",color:"#fff",fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"Poppins,sans-serif"}}>{saving?"Saving…":"Save Changes"}</button>
            <button onClick={()=>{setName(user?.name||"");setPhone(user?.phone||"");setError("");setEditing(false);}} style={{height:46,padding:"0 24px",border:"1.5px solid #C3BCB4",borderRadius:999,background:"transparent",fontSize:14,fontWeight:600,color:"#555",cursor:"pointer",fontFamily:"Poppins,sans-serif"}}>Cancel</button>
          </div>
        </div>
      ):(
        <div style={{background:"#fff",border:"1.5px solid #E0D9D1",borderRadius:14,overflow:"hidden"}}>
          {[["Email",user?.email||"—","Your login email address"],["Name",user?.name||"Not set","Your display name"],["Mobile",user?.phone?`+91 ${user.phone}`:"Not added","For order notifications"]].map(([label,value,hint],i,arr)=>(
            <div key={label} style={{display:"flex",alignItems:"center",padding:"20px 24px",borderBottom:i<arr.length-1?"1px solid #F0EDE9":"none"}}>
              <div style={{minWidth:140}}>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700,color:"#0E0E0E"}}>{label}</div>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:"#aaa",marginTop:2}}>{hint}</div>
              </div>
              <div style={{fontFamily:"Manrope,sans-serif",fontSize:14,color:value==="Not set"||value==="Not added"?"#aaa":"#333",flex:1}}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Account Page ──────────────────────────────────── */
export default function AccountPage() {
  const { user, setUser, loading: authLoading, logout, refetchUser } = useUser();
  const [showLoginModal,setShowLoginModal]=useState(true);
  const [step,setStep]=useState("email");
  const [email,setEmail]=useState("");
  const [otp,setOtp]=useState("");
  const [sessionToken,setSessionToken]=useState("");
  const [sending,setSending]=useState(false);
  const [verifying,setVerifying]=useState(false);
  const [loginError,setLoginError]=useState("");
  const [activeTab,setActiveTab]=useState("orders");
  const [orders,setOrders]=useState([]);
  const [ordersLoading,setOrdersLoading]=useState(false);
  const [showAddForm,setShowAddForm]=useState(false);
  const [reviewOrder,setReviewOrder]=useState(null);

  // Show modal again if user logs out
  useEffect(()=>{ if(!user&&!authLoading) setShowLoginModal(true); },[user,authLoading]);

  useEffect(()=>{
    if(user&&activeTab==="orders"){
      setOrdersLoading(true);
      fetch("/api/orders/my").then(r=>r.json()).then(j=>{if(j.success)setOrders(j.data);}).catch(()=>{}).finally(()=>setOrdersLoading(false));
    }
  },[user,activeTab]);

  const handleSendOtp=async()=>{
    setLoginError("");
    const cleaned=email.trim().toLowerCase();
    if(!cleaned||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)){setLoginError("Please enter a valid email address");return;}
    setSending(true);
    try{
      const res=await fetch("/api/auth/user/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:cleaned})});
      const json=await res.json();
      if(json.success){setSessionToken(json.data.session_token);setStep("otp");}
      else setLoginError(json.message||"Failed to send OTP. Please try again.");
    }catch{setLoginError("Network error. Please try again.");}
    finally{setSending(false);}
  };

  const handleVerifyOtp=async()=>{
    setLoginError("");
    if(!otp||otp.length<6){setLoginError("Please enter the 6-digit OTP");return;}
    setVerifying(true);
    try{
      const res=await fetch("/api/auth/user/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim().toLowerCase(),otp,session_token:sessionToken})});
      const json=await res.json();
      if(json.success){await refetchUser();setShowLoginModal(false);setStep("email");setOtp("");}
      else setLoginError(json.message||"Invalid OTP. Please try again.");
    }catch{setLoginError("Network error. Please try again.");}
    finally{setVerifying(false);}
  };

  const handleLogout=async()=>{
    await logout();
    setOrders([]);setStep("email");setEmail("");setOtp("");setShowLoginModal(true);
  };

  const fmtDate=(d)=>d?new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"";
  const STATUS_COLOR={
    pending:{bg:"#FEF3C7",color:"#92400E"},confirmed:{bg:"#DBEAFE",color:"#1E40AF"},
    processing:{bg:"#EDE9FE",color:"#5B21B6"},shipped:{bg:"#D1FAE5",color:"#065F46"},
    out_for_delivery:{bg:"#A7F3D0",color:"#064E3B"},delivered:{bg:"#BBF7D0",color:"#14532D"},
    cancelled:{bg:"#FEE2E2",color:"#991B1B"},
  };

  if(authLoading) return (
    <><Navbar/>
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F7F5F3"}}>
      <div style={{width:32,height:32,border:"3px solid #E5DDD5",borderTopColor:"#F85700",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    </div><Footer/></>
  );

  return (
    <>
      <Navbar/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes acModal{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .ac-page{background:#F7F5F3;min-height:100vh;font-family:'Poppins',sans-serif}
        .ac-container{max-width:1100px;margin:0 auto;padding:0 40px 80px}
        .login-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
        .login-modal{background:#fff;border-radius:16px;width:100%;max-width:440px;padding:40px 36px 36px;box-shadow:0 24px 60px rgba(0,0,0,0.18);animation:acModal .25s ease;position:relative}
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
        .order-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:12px;padding:20px 24px;margin-bottom:16px}
        .order-track-btn{height:36px;padding:0 18px;border:1.5px solid #F85700;border-radius:999px;background:#fff;color:#F85700;font-size:12px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;font-family:'Poppins',sans-serif}
        .order-track-btn:hover{background:#F85700;color:#fff}
        .ac-add-btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border:none;border-radius:999px;background:#F85700;color:#fff;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:24px;font-family:'Poppins',sans-serif}
        .ac-address-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:12px;padding:20px 24px;margin-bottom:16px}
        .ac-remove-btn{height:36px;padding:0 18px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #e53e3e;color:#e53e3e;font-family:'Poppins',sans-serif}
        .ac-remove-btn:hover{background:#e53e3e;color:#fff}
        @media(max-width:768px){.ac-container{padding:0 16px 60px}.login-modal{padding:28px 20px 24px}}
      `}</style>

      {/* ── Login Modal ── */}
      {!user&&showLoginModal&&(
        <div className="login-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowLoginModal(false)}}>
          <div className="login-modal">
            <button onClick={()=>setShowLoginModal(false)} style={{position:"absolute",top:16,right:16,width:32,height:32,borderRadius:"50%",background:"#F0EDE9",border:"none",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}>✕</button>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <Image src={logo} alt="Riya Art Palace" width={130} height={44} style={{height:44,width:"auto",objectFit:"contain"}} priority/>
            </div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:22,fontWeight:800,color:"#0E0E0E",marginBottom:4}}>Riya Art Palace</div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#888",marginBottom:28}}>Sign in to your account</div>
            {step==="email"?(
              <>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700,color:"#444",marginBottom:8}}>Email Address</div>
                <input type="email" style={{width:"100%",height:50,border:"1.5px solid "+(loginError?"#e53e3e":"#C3BCB4"),borderRadius:10,padding:"0 16px",fontSize:15,color:"#333",outline:"none",background:"#FAF8F6",marginBottom:6}}
                  placeholder="Enter your email address" value={email}
                  onChange={e=>{setEmail(e.target.value);setLoginError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleSendOtp()} autoFocus/>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:12}}>{loginError}</div>}
                <button onClick={handleSendOtp} disabled={sending} style={{width:"100%",height:52,border:"none",borderRadius:999,background:sending?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:sending?"not-allowed":"pointer",fontFamily:"Poppins,sans-serif",marginTop:8}}>
                  {sending?"Sending OTP...":"Send OTP →"}
                </button>
              </>
            ):(
              <>
                <button onClick={()=>{setStep("email");setOtp("");setLoginError("");}} style={{background:"none",border:"none",fontSize:13,color:"#F85700",cursor:"pointer",fontWeight:600,marginBottom:16,padding:0,fontFamily:"Manrope,sans-serif"}}>
                  ← Change email ({email})
                </button>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:700,color:"#444",marginBottom:8}}>Enter OTP</div>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#888",marginBottom:14}}>A 6-digit OTP has been sent to {email}</div>
                <input type="tel" maxLength={6} style={{height:56,border:"1.5px solid "+(loginError?"#e53e3e":"#C3BCB4"),borderRadius:10,padding:"0 16px",fontSize:28,color:"#333",outline:"none",background:"#FAF8F6",width:"100%",textAlign:"center",letterSpacing:12,marginBottom:6}}
                  placeholder="------" value={otp}
                  onChange={e=>{setOtp(e.target.value.replace(/\D/g,""));setLoginError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleVerifyOtp()} autoFocus/>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:12}}>{loginError}</div>}
                <button onClick={handleVerifyOtp} disabled={verifying} style={{width:"100%",height:52,border:"none",borderRadius:999,background:verifying?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Poppins,sans-serif",marginTop:8}}>
                  {verifying?"Verifying...":"Verify OTP →"}
                </button>
              </>
            )}
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:11,color:"#AAA",marginTop:16,lineHeight:1.6}}>
              By continuing, you agree to our <a href="/privacy-policy" style={{color:"#F85700",textDecoration:"none"}}>Privacy Policy</a> &amp; <a href="/terms" style={{color:"#F85700",textDecoration:"none"}}>Terms of Service</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content (always visible behind modal) ── */}
      <div className="ac-page">
        <div className="ac-container">
          <div className="ac-header">
            <div className="ac-header-title">My Account</div>
            {user&&<button className="ac-logout-btn" onClick={handleLogout}>Log out</button>}
          </div>

          {user&&(
            showAddForm?(
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
                        <div style={{width:28,height:28,border:"3px solid #E5DDD5",borderTopColor:"#F85700",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                      </div>
                    ):orders.length===0?(
                      <div className="ac-empty">You haven't placed any orders yet.</div>
                    ):orders.map(order=>{
                      const sc=STATUS_COLOR[order.orderStatus]||{bg:"#F3F4F6",color:"#374151"};
                      return(
                        <div key={order.id} className="order-card">
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
                            <div>
                              <div style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#888",letterSpacing:"0.04em",marginBottom:2}}>ORDER</div>
                              <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#0E0E0E"}}>{order.orderId}</div>
                              <div style={{fontSize:12,color:"#aaa",marginTop:3}}>{fmtDate(order.createdAt)}</div>
                            </div>
                            <span style={{padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:700,background:sc.bg,color:sc.color,alignSelf:"flex-start"}}>
                              {order.orderStatus?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                            </span>
                          </div>
                          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                            {order.items?.map((item,idx)=>(
                              <div key={idx} style={{position:"relative",flexShrink:0}}>
                                {item.image?<img src={item.image} alt={item.productName} style={{width:64,height:64,borderRadius:10,objectFit:"cover",border:"1.5px solid #E0D9D1",display:"block"}}/>
                                  :<div style={{width:64,height:64,borderRadius:10,background:"#F0EDE9",border:"1.5px solid #E0D9D1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#ccc"}}>🖼</div>}
                                {item.quantity>1&&<span style={{position:"absolute",top:-6,right:-6,background:"#0E0E0E",color:"#fff",fontSize:10,fontWeight:700,borderRadius:999,padding:"1px 6px",minWidth:18,textAlign:"center"}}>×{item.quantity}</span>}
                              </div>
                            ))}
                          </div>
                          <div style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#555",marginBottom:12,lineHeight:1.6}}>
                            {order.items?.slice(0,2).map(i=>i.productName).join(", ")}
                            {order.items?.length>2&&<span style={{color:"#aaa"}}> +{order.items.length-2} more</span>}
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,paddingTop:12,borderTop:"1px solid #F0EDE9"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontFamily:"Manrope,sans-serif",fontSize:15,fontWeight:800,color:"#0E0E0E"}}>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                              <span style={{fontSize:11,color:"#aaa",fontWeight:600}}>{order.paymentMethod}</span>
                            </div>
                            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                              {order.awbNumber&&<span style={{fontSize:11,color:"#888",fontFamily:"monospace"}}>AWB: {order.awbNumber}</span>}
                              {order.awbNumber&&<a href={`/track/${encodeURIComponent(order.awbNumber)}`} className="order-track-btn">🚚 Track Order</a>}
                              {!["pending","cancelled","returned"].includes(order.orderStatus)&&(
                                <button className="order-track-btn" style={{borderColor:"#0E0E0E",color:"#0E0E0E"}} onClick={()=>setReviewOrder(order)}>✍ Write Review</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab==="details"&&(
                  <AccountDetailsTab user={user} onUpdate={(updated)=>setUser(prev=>({...prev,...updated}))}/>
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
                          {addr.country}<br/>{addr.phone}
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
            )
          )}
        </div>
      </div>

      <ValuesSection/>
      <FollowUs/>
      <Footer/>
      {reviewOrder&&<ReviewModal order={reviewOrder} onClose={()=>setReviewOrder(null)}/>}
    </>
  );
}
