import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import * as S from '../../../styles/HomePage/HomeCarousal.style';
import { slides } from './homeCarousalService';

export const HomeCarousel = () => {

  return (
    <S.CarouselWrapper>
      <Carousel 
        fade 
        indicators={true} 
        interval={5000}
        nextIcon={<S.NextBtn><span className="material-symbols-outlined">arrow_forward_ios</span></S.NextBtn>}
        prevIcon={<S.PrevBtn><span className="material-symbols-outlined">arrow_back_ios</span></S.PrevBtn>}
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <S.SlideImage
              src={slide.image}
              alt={slide.title}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </S.CarouselWrapper>
  );
};

export default HomeCarousel;