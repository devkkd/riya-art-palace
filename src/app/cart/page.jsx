"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cart-page { background: #F7F5F3; min-height: 100vh; padding-bottom: 80px; }
        .cart-inner { max-width: 1100px; margin: 0 auto; padding: 40px 40px 0; }

        .cart-title {
          font-family: "Manrope", sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0E0E0E;
          letter-spacing: -0.02em;
          margin-bottom: 32px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        /* ── Items list ── */
        .cart-items { display: flex; flex-direction: column; gap: 16px; }

        .cart-item {
          background: #fff;
          border: 1.5px solid #E0D9D1;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .cart-item-img {
          width: 90px;
          height: 90px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f0ede9;
        }

        .cart-item-info { flex: 1; min-width: 0; }

        .cart-item-name {
          font-family: "Manrope", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0E0E0E;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .cart-item-name:hover { color: #F85700; }

        .cart-item-price {
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          margin-bottom: 14px;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cart-qty-ctrl {
          display: flex;
          align-items: center;
          height: 40px;
          border: 1.5px solid #C3BCB4;
          border-radius: 999px;
          overflow: hidden;
        }

        .cart-qty-btn {
          width: 36px;
          height: 100%;
          border: none;
          background: transparent;
          font-size: 20px;
          font-weight: 300;
          color: #111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .15s;
        }
        .cart-qty-btn:hover { background: #f0ede9; }

        .cart-qty-num {
          min-width: 40px;
          text-align: center;
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0E0E0E;
        }

        .cart-remove-btn {
          background: none;
          border: none;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #e53e3e;
          cursor: pointer;
          padding: 0;
        }
        .cart-remove-btn:hover { text-decoration: underline; }

        .cart-item-subtotal {
          font-family: "Manrope", sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #0E0E0E;
          white-space: nowrap;
          flex-shrink: 0;
          align-self: center;
        }

        /* ── Order summary ── */
        .cart-summary {
          background: #fff;
          border: 1.5px solid #E0D9D1;
          border-radius: 14px;
          padding: 28px 24px;
          position: sticky;
          top: 100px;
        }

        .cart-summary-title {
          font-family: "Manrope", sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0E0E0E;
          margin-bottom: 20px;
        }

        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          color: #555;
          padding: 10px 0;
          border-bottom: 1px solid #f0ede9;
        }
        .cart-summary-row:last-of-type { border-bottom: none; }

        .cart-summary-total {
          display: flex;
          justify-content: space-between;
          font-family: "Manrope", sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #0E0E0E;
          padding: 16px 0 20px;
          border-top: 2px solid #E0D9D1;
          margin-top: 4px;
        }

        .cart-checkout-btn {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 999px;
          background: #F85700;
          color: #fff;
          font-family: "Manrope", sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, transform .15s;
          margin-bottom: 12px;
        }
        .cart-checkout-btn:hover { background: #e84f00; transform: translateY(-1px); }

        .cart-continue-btn {
          width: 100%;
          height: 48px;
          border: 1.5px solid #C3BCB4;
          border-radius: 999px;
          background: transparent;
          color: #555;
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .cart-continue-btn:hover { border-color: #F85700; color: #F85700; }

        .cart-clear-btn {
          background: none;
          border: none;
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          color: #aaa;
          cursor: pointer;
          display: block;
          margin: 14px auto 0;
          text-decoration: underline;
        }
        .cart-clear-btn:hover { color: #e53e3e; }

        /* ── Empty state ── */
        .cart-empty {
          text-align: center;
          padding: 100px 20px;
        }
        .cart-empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .cart-empty-title {
          font-family: "Manrope", sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0E0E0E;
          margin-bottom: 10px;
        }
        .cart-empty-sub {
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          color: #888;
          margin-bottom: 32px;
        }
        .cart-shop-btn {
          height: 52px;
          padding: 0 40px;
          border: none;
          border-radius: 999px;
          background: #F85700;
          color: #fff;
          font-family: "Manrope", sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
        }
        .cart-shop-btn:hover { background: #e84f00; }

        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 600px) {
          .cart-inner { padding: 24px 16px 0; }
          .cart-item { padding: 16px; gap: 14px; }
          .cart-item-img { width: 70px; height: 70px; }
          .cart-title { font-size: 22px; }
        }
      `}</style>

      <div className="cart-page">
        <div className="cart-inner">
          <div className="cart-title">
            My Cart {totalItems > 0 && <span style={{ fontSize: 18, fontWeight: 500, color: "#888" }}>({totalItems} item{totalItems !== 1 ? "s" : ""})</span>}
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <div className="cart-empty-title">Your cart is empty</div>
              <div className="cart-empty-sub">Looks like you haven't added anything yet.</div>
              <button className="cart-shop-btn" onClick={() => router.push("/products")}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-layout">

              {/* Items */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.productId} className="cart-item">
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                      />
                    ) : (
                      <div className="cart-item-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 28 }}>🖼</div>
                    )}

                    {/* Info */}
                    <div className="cart-item-info">
                      <div
                        className="cart-item-name"
                        onClick={() => item.slug && router.push(`/products/${item.slug}`)}
                      >
                        {item.name}
                      </div>
                      <div className="cart-item-price">
                        ₹{item.price} / {item.priceUnit || "Piece"}
                      </div>
                      <div className="cart-item-actions">
                        {/* Qty stepper */}
                        <div className="cart-qty-ctrl">
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Decrease"
                          >−</button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase"
                          >+</button>
                        </div>
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <div className="cart-summary-title">Order Summary</div>

                {items.map((item) => (
                  <div key={item.productId} className="cart-summary-row">
                    <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}

                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>

                <button
                  className="cart-checkout-btn"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="cart-continue-btn"
                  onClick={() => router.push("/products")}
                >
                  Continue Shopping
                </button>

                <button className="cart-clear-btn" onClick={clearCart}>
                  Clear cart
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
