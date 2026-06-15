"use client";
import hero from "../assets/hero.png";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
export default function CategoryBanner() {
  return (
    <section
  className="home-section"
  style={{
    backgroundColor: "#F7F5F3",
  }}
>
      <style>{`
        .category-banner-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }

      .category-whatsapp-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: #5AC44D;
  color: #fff;
  text-decoration: none;

  padding: 15px 20px;
  border-radius: 99px;

  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;

  z-index: 9999;

  box-shadow: 0 8px 25px rgba(0,0,0,.15);
  transition: all .3s ease;
}

.category-whatsapp-btn:hover {
  transform: translateY(-2px);
}

.category-whatsapp-btn svg {
  width: 22px;
  height: 22px;
  color: #fff;
  flex-shrink: 0;
}

.category-whatsapp-btn span {
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
}

@media (max-width:768px) {
  .category-whatsapp-btn {
    right: 16px;
    bottom: 16px;
    padding: 12px 18px;
    font-size: 16px;
  }

  .category-whatsapp-btn span {
    font-size: 16px;
  }

  .category-whatsapp-btn svg {
    width: 20px;
    height: 20px;
  }
}
@media (max-width: 600px) {
  .category-banner-img {
    height: 300px;
  }

  .category-whatsapp-btn {
    width: 120px;
    height: 50px;
    right: 16px;
    bottom: 16px;
    font-size: 16px;
  }

  .category-whatsapp-btn svg {
    width: 20px;
    height: 20px;
  }
}
      `}</style>

    <div
  style={{
    position: "relative",
    marginBottom: "0",
    lineHeight: 0,
  }}
>

       <Image
  src={hero}
  alt="Rajasthani Puppets"
  width={1920}
  height={520}
  className="category-banner-img"
/>

        {/* Play Button */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.25)",
            border: "2px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(2px)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>

        {/* WhatsApp Button */}
     <a
  href="https://wa.me/919876543210"
  target="_blank"
  rel="noopener noreferrer"
  className="category-whatsapp-btn"
>
  <FaWhatsapp />
  <span>For Bulk</span>
</a>

      </div>
    </section>
  );
}