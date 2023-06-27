import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LogoSlider.css';

const LogoSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="logo-slider">
      <Slider {...settings}>
        <div className="logo-slider-item">
          <a href="#" title="Gümüşhane Blockchain">
            <img src="@site/static/img/partner/Group4.png" alt="Logo 1" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 2">
            <img src="@site/static/img/partner/Group2.png" alt="Logo 2" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 3">
            <img src="@site/static/img/partner/Group3.png" alt="Logo 3" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 4">
            <img src="@site/static/img/partner/Group1.png" alt="Logo 4" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 5">
            <img src="@site/static/img/partner/Group5.png" alt="Logo 5" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 6">
            <img src="@site/static/img/partner/Group6.png" alt="Logo 6" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 7">
            <img src="@site/static/img/partner/Group7.png" alt="Logo 7" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 8">
            <img src="@site/static/img/partner/Group8.png" alt="Logo 8" />
          </a>
        </div>
        <div className="logo-slider-item">
          <a href="#" title="Logo 9">
            <img src="@site/static/img/partner/Group9.png" alt="Logo 9" />
          </a>
        </div>
      </Slider>
    </div>
  );
};

export default LogoSlider;
