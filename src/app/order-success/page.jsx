"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Navbar/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        .os-page{background:#F7F5F3;min-height:80vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
        .os-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:20px;padding:52px 48px;max-width:520px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.06)}
        .os-icon{font-size:64px;animation:pop 0.5s ease;display:block;margin-bottom:20px}
        .os-title{font-family:"Manrope",sans-serif;font-size:26px;font-weight:800;color:#0E0E0E;margin-bottom:10px}
        .os-sub{font-family:"Manrope",sans-serif;font-size:15px;color:#666;line-height:1.7;margin-bottom:28px}
        .os-id{background:#F7F5F3;border-radius:10px;padding:14px 20px;font-family:monospace;font-size:15px;font-weight:700;color:#0E0E0E;margin-bottom:32px;letter-spacing:0.02em}
        .os-btn{display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 36px;border-radius:999px;font-family:"Manrope",sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
        .os-btn-primary{background:#F85700;color:#fff;border:none}
        .os-btn-primary:hover{background:#e84f00;transform:translateY(-1px)}
        .os-btn-sec{background:transparent;color:#555;border:1.5px solid #C3BCB4;margin-left:12px}
        .os-btn-sec:hover{border-color:#F85700;color:#F85700}
        @media(max-width:600px){.os-card{padding:36px 20px}.os-btn-sec{margin-left:0;margin-top:10px}.os-actions{flex-direction:column;align-items:stretch}}
      `}</style>
      <div className="os-page">
        <div className="os-card">
          <span className="os-icon">🎉</span>
          <div className="os-title">Order Placed Successfully!</div>
          <div className="os-sub">
            Thank you for shopping with Riya Art Palace.<br/>
            Your order has been confirmed and will be shipped soon.
          </div>
          {orderId && (
            <div className="os-id">Order ID: {orderId}</div>
          )}
          <div className="os-actions" style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
            <button className="os-btn os-btn-primary" onClick={() => router.push("/account")}>
              View My Orders
            </button>
            <button className="os-btn os-btn-sec" onClick={() => router.push("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default function OrderSuccessPage() {
  return <Suspense fallback={null}><OrderSuccessContent /></Suspense>;
}
