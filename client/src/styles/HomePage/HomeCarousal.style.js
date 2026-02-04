import styled from 'styled-components';

export const CarouselWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;

  .carousel-indicators {
    bottom: 10px;
    background: rgba(255, 255, 255, 0.5);
    padding: 4px 10px;
    border-radius: 20px;
    width: fit-content;
    margin: 0 auto;
    
    [data-bs-target] {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #fff;
      margin: 0 3px;
      border: none;
      opacity: 0.5;
    }

    .active {
      width: 16px;
      border-radius: 10px;
      opacity: 1;
      background-color: #000;
    }
    
    @media (min-width: 768px) {
      bottom: 20px;
      padding: 5px 15px;

      [data-bs-target] {
        width: 8px;
        height: 8px;
        margin: 0 4px;
      }
      
      .active {
        width: 20px;
      }
  }
  
  }
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 450px; 
  object-fit: cover;

  @media (min-width: 480px) {
    height: 250px;
  }
  
  @media (min-width: 768px) {
    height: 350px;
  }

  @media (min-width: 1024px) {
    height: 450px;
  }
`;

const NavBtn = styled.span`
  background: rgba(255, 255, 255, 0.8);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #333;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
    background: #fff;
  }

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  @media (min-width: 1024px) {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
`;

export const PrevBtn = styled(NavBtn)``;
export const NextBtn = styled(NavBtn)``;

export const CustomCaption = styled.div`
  position: absolute;
  right: 15%;
  top: 35%;
  text-align: center;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

export const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  font-style: italic;
  margin-bottom: 0;
`;

export const SubTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
`;

export const ShopLink = styled.a`
  color: #fff;
  font-size: 1.8rem;
  text-decoration: underline;
  font-weight: 600;
  display: inline-block;
  margin-top: 10px;
  &:hover { color: #eee; }
`;