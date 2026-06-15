"use client";
import Image from "next/image";
import missionImg from "../assets/mission.png";
import visionImg from "../assets/vision.png";
import womenImg from "../assets/women.png";
import craftmanshipImg from "../assets/craftmanship.png";
const valuesData = [
  {
   
   icon: (
  <Image
    src={missionImg}
    alt="Mission"
    width={70}
    height={70}
  />
),
    title: "Our Mission",
    text: "To Preserve Indian Handicraft Traditions While Empowering Artisan Communities Through Sustainable Livelihood Opportunities.",
  },
  {
  icon: (
  <Image src={visionImg} alt="Vision" width={70} height={70} />
),
    title: "Our Vision",
    text: "To Bring The Timeless Beauty Of Rajasthan Into Homes Around The World Through Authentic Handcrafted Creations.",
  },
  {
    icon: (
  <Image src={womenImg} alt="Women Empowerment" width={70} height={70} />

),
    title: "Women Empowerment",
    text: "We Proudly Support 5,000+ Women Artisans Through Work-From-Home Opportunities, Preserving Traditional Art Forms For Future Generations.",
  },
  {
    icon: (
  <Image src={craftmanshipImg} alt="Craftsmanship" width={70} height={70} />
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
  font-family: "Manrope", sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  color: #0E0E0E;
  margin-bottom: 14px;
}

  .value-text {
  font-family: "Mona Sans", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  color: #555;
  max-width: 260px;
  margin: 0 auto;
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