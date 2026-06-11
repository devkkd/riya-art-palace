"use client";

const valuesData = [
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="10" stroke="#FF6500" strokeWidth="1.8" />
        <line x1="26" y1="4" x2="26" y2="14" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="26" y1="38" x2="26" y2="48" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="26" x2="14" y2="26" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="38" y1="26" x2="48" y2="26" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="26" cy="26" r="3" fill="#FF6500" />
      </svg>
    ),
    title: "Our Mission",
    text: "To Preserve Indian Handicraft Traditions While Empowering Artisan Communities Through Sustainable Livelihood Opportunities.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <ellipse cx="18" cy="26" rx="10" ry="7" stroke="#FF6500" strokeWidth="1.8" />
        <ellipse cx="34" cy="26" rx="10" ry="7" stroke="#FF6500" strokeWidth="1.8" />
        <line x1="8" y1="26" x2="4" y2="22" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="44" y1="26" x2="48" y2="22" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Our Vision",
    text: "To Bring The Timeless Beauty Of Rajasthan Into Homes Around The World Through Authentic Handcrafted Creations.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="18" cy="18" r="6" stroke="#FF6500" strokeWidth="1.8" />
        <circle cx="34" cy="18" r="6" stroke="#FF6500" strokeWidth="1.8" />
        <circle cx="26" cy="32" r="6" stroke="#FF6500" strokeWidth="1.8" />
        <path d="M10 42 Q18 36 26 38 Q34 36 42 42" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    ),
    title: "Women Empowerment",
    text: "We Proudly Support 5,000+ Women Artisans Through Work-From-Home Opportunities, Preserving Traditional Art Forms For Future Generations.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="10" y="18" width="24" height="20" rx="3" stroke="#FF6500" strokeWidth="1.8" />
        <path d="M34 26 L42 22 L42 34 L34 30" stroke="#FF6500" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="28" r="3" stroke="#FF6500" strokeWidth="1.5" />
        <line x1="16" y1="18" x2="16" y2="14" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="18" x2="22" y2="12" stroke="#FF6500" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Craftsmanship",
    text: "Every Piece Reflects Beauty, Culture And Artistic Richness Through Intricate Detailing, Traditional Techniques And Locally Sourced Materials.",
  },
];

export default function ValuesSection() {
  return (
    <>
      <style jsx>{`
  .values-section {
    background: #F7F5F3;
    padding: 10px 20px;
  }

  .values-container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .value-item {
    text-align: center;
    padding: 24px 20px;
    border-right: 1px solid #d8d2cc;
  }

  .value-item:last-child {
    border-right: none;
  }

  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
  }

  .value-title {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin-bottom: 12px;
    font-family: Arial, sans-serif;
  }

  .value-text {
    font-size: 12px;
    line-height: 1.7;
    color: #666;
    max-width: 220px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  /* Tablet */
  @media (max-width: 992px) {
    .values-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }

    .value-item {
      border-right: none;
      padding: 30px 20px;
    }

    .value-text {
      max-width: 300px;
    }
  }

  /* Mobile */
  @media (max-width: 576px) {
    .values-section {
      padding: 50px 16px;
    }

    .values-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .value-item {
      padding: 0;
      border: none;
    }

    .value-title {
      font-size: 20px;
    }

    .value-text {
      font-size: 14px;
      max-width: 100%;
    }
  }
`}</style>

      <section className="values-section">
        <div className="values-container">
          <div className="values-grid">
            {valuesData.map((item, index) => (
              <div key={index} className="value-item">
                <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
  }}
>
  {item.icon}
</div>

                <h3 className="value-title">
                  {item.title}
                </h3>

                <p className="value-text">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}