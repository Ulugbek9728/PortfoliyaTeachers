import styled from "styled-components";

export const FakultetWrapper = styled.div`
  margin-bottom: 80px;
  .news-head {
    margin: 80px 0;
    border-bottom: 2px solid #efeeee;
    .container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      p {
        padding-bottom: 10px;
        font-family: "Montserrat";
        font-weight: 800;
        font-size: 40px;
        line-height: 59px;
        color: #37363c;
      }
    }
  }
  .swiper-pagination-bullets {
    display: none;
  }
  .line-m {
    margin: 25px 0;
  }
  @media only screen and (max-width: 1512px) {
    margin-bottom: 60px;
    .news-head {
      margin: 60px 0;
      .container {
        p {
          font-size: 26px;
          line-height: 32px;
        }
      }
    }
    .line-m {
      margin: 10px 0;
    }
  }
  @media only screen and (max-width: 1100px) {
    .card-news {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media only screen and (max-width: 834px) {
    margin-bottom: 60px;
    .news-head {
      margin: 60px 0;
      .container {
        p {
          font-size: 20px;
          line-height: 24px;
        }
      }
    }
  }
  @media only screen and (max-width: 780px) {
    margin-bottom: 60px;
    .news-head {
      margin: 40px 0 20px 0;
      .container {
        p {
          font-size: 16px;
          line-height: 20px;
        }
      }
    }
  }
  @media only screen and (max-width: 580px) {
    margin-bottom: 40px;
  }
`;

export const FakultetCardWrapper = styled.div`
  cursor: pointer;
  border-radius: 10px;
  height: 370px;
  position: relative;
  z-index: 10;
  overflow: hidden;
  .back-img {
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: all 0.3s linear;
  }
  .back-color {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .icon {
    width: 85px;
    height: 85px;
    object-fit: cover;
    object-position: center;
  }
  p {
    margin-top: 30px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    text-transform: uppercase;
    text-align: center;
    color: #ffffff;
  }
  &:hover {
    .back-img {
      width: 110%;
      height: 110%;
      transition: all 0.3s linear;
    }
  }
  @media only screen and (max-width: 1512px) {
    height: 300px;
    p {
      font-size: 20px;
      line-height: 24px;
    }
  }
  @media only screen and (max-width: 580px) {
    height: 170px;
    .icon {
      width: 50px;
      height: 50px;
      object-fit: cover;
      object-position: center;
    }
    p {
      margin-top: 10px;
      font-size: 13px;
      line-height: 16px;
    }
  }
`;
