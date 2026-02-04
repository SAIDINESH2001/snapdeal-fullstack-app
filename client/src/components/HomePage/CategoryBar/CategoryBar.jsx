import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as S from '../../../styles/HomePage/categoryBar.style'; 
import { fetchCategory } from './categoryService';
import { useNavigate } from 'react-router-dom';

export const CategoryBar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoriesData();
  }, []);

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const handleNavigation = (mainCat, subCat, type = "all") => {
    const main = encodeURIComponent(mainCat);
    const sub = encodeURIComponent(subCat);
    const pType = encodeURIComponent(type);
    
    navigate(`/products/${main}/${sub}/${pType}`);
  };

  return (
    <S.NavWrapper onMouseLeave={() => setActiveTab(null)}>
      <div className='w-100'>
        <S.NavContainer>
          {categories.map((cat) => (
            <S.NavItem 
              key={cat._id} 
              onMouseEnter={() => setActiveTab(cat._id)}
              onClick={() => setActiveTab(activeTab === cat._id ? null : cat._id)}
            >
              <img src={cat.categoryImage} alt="" />
              {cat.categoryName}
            </S.NavItem>
          ))}
        </S.NavContainer>
      </div>

      {categories.map((cat) => (
        <S.MegaDropdown key={`drop-${cat._id}`} $show={activeTab === cat._id}>
          <Container fluid className='px-3 px-md-4'>
            <Row className="g-3 g-md-4 gx-lg-5">
              {chunkArray(cat.sections || [], 2).map((columnSections, colIdx) => (
                <Col key={colIdx} xs={12} sm={6} md={3} className={colIdx !== 3 ? "border-end" : ""}>
                  {columnSections.map((section, secIdx) => (
                    <div key={secIdx} className="mb-4">
                      <S.SectionTitle 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigation(cat.categoryName, section.sectionName)}
                      >
                        {section.sectionName}
                      </S.SectionTitle>

                      {section.items.map((item, i) => (
                        <S.ListItem 
                          key={i} 
                          onClick={() => handleNavigation(cat.categoryName, section.sectionName, item.itemName)}
                        >
                          {item.itemName}
                        </S.ListItem>
                      ))}

                      <S.ViewAll 
                        onClick={() => handleNavigation(cat.categoryName, section.sectionName)}
                      >
                        View All
                      </S.ViewAll>

                      {secIdx < columnSections.length - 1 && (<hr className="my-3 opacity-25" />)}
                    </div>
                  ))}
                </Col>
              ))}
            </Row>
          </Container>
        </S.MegaDropdown>
      ))}
    </S.NavWrapper>
  );
};