import React from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as S from '../../../styles/HomePage/HomeCarousal.style';
import { slides } from './homeCarousalService';

export const HomeCarousel = () => {
  const navigate = useNavigate();

  const handleSlideClick = (slide) => {
    const category = encodeURIComponent(slide.title);
    navigate(`/products/${category}`);
  };

  return (
    <>
      <S.CarouselWrapper>
        <Carousel 
          fade 
          indicators={true} 
          interval={5000}
          nextIcon={<S.NextBtn><span className="material-symbols-outlined">arrow_forward_ios</span></S.NextBtn>}
          prevIcon={<S.PrevBtn><span className="material-symbols-outlined">arrow_back_ios</span></S.PrevBtn>}
        >
          {slides.map((slide) => (
            <Carousel.Item 
              key={slide.id} 
              onClick={() => handleSlideClick(slide)}
              style={{ cursor: 'pointer' }}
            >
              <S.SlideImage
                src={slide.image}
                alt={slide.title}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </S.CarouselWrapper>
      <div className='text-center px-4'>
        <img 
          src="https://g.sdlcdn.com/imgs/a/b/c/feedConfig/freedeliverystripwebupdated.jpg" 
          alt="Free Delivery" 
          className='mt-3 object-fit-cover rounded mb-5 w-100' 
          style={{ width: '98%' }}
        />
      </div>
    </>
  );
};

export default HomeCarousel;