import React from "react";
import Client1 from "../assets/img/Brands/Client1.jpg";
import Client2 from "../assets/img/Brands/Client2.jpg";
import Client3 from "../assets/img/Brands/Client3.jpg";
import Client4 from "../assets/img/Brands/Client4.jpg";
import Client5 from "../assets/img/Brands/Client5.jpg";
import Client6 from "../assets/img/Brands/Client6.jpg";
import Client7 from "../assets/img/Brands/Client7.jpg";
import Client8 from "../assets/img/Brands/Client8.jpg";
import Client9 from "../assets/img/Brands/Client9.jpg";
import Client10 from "../assets/img/Brands/Client10.jpg";
import Client11 from "../assets/img/Brands/Client11.jpg";
import Client12 from "../assets/img/Brands/Client12.jpg";
import Client13 from "../assets/img/Brands/Client13.jpg";
import Client14 from "../assets/img/Brands/Client14.jpg";
import Client15 from "../assets/img/Brands/Client15.jpg";
import Client16 from "../assets/img/Brands/Client16.jpg";

import styled, { keyframes, css } from "styled-components";

function Brands() {
  const row1 = [
    Client1,
    Client2,
    Client3,
    Client4,
    Client5,
    Client6,
    Client7,
    Client8,
  ];

  const row2 = [
    Client9,
    Client10,
    Client11,
    Client12,
    Client13,
    Client14,
    Client15,
    Client16,
  ];

  return (
    <div className="overflow-hidden">
      <AppContainer className="size overflow-hidden">
      <Wrapper>
        <Text>Brands</Text>
        <Note>Our customers have gotten offers from awesome companies.</Note>
        <Marquee>
          <MarqueeGroup>
            {row1.map((el, i) => (
              <ImageGroup key={i}>
                <Image src={el} />
              </ImageGroup>
            ))}
          </MarqueeGroup>
          <MarqueeGroup>
            {row1.map((el, i) => (
              <ImageGroup key={i}>
                <Image src={el} />
              </ImageGroup>
            ))}
          </MarqueeGroup>
        </Marquee>
        <Marquee>
          <MarqueeGroup2>
            {row2.map((el, i) => (
              <ImageGroup key={i}>
                <Image src={el} />
              </ImageGroup>
            ))}
          </MarqueeGroup2>
          <MarqueeGroup2>
            {row2.map((el, i) => (
              <ImageGroup key={i}>
                <Image src={el} />
              </ImageGroup>
            ))}
          </MarqueeGroup2>
        </Marquee>
      </Wrapper>
    </AppContainer>
    </div>
  );
}

export default Brands;

const AppContainer = styled.div`
  width: 100vw;
  height: 50vh;
  color: #000000;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 35px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #02203c;
`;

const Note = styled.div`
  font-size: 18px;
  font-weight: 200;
  margin-bottom: 40px;
  color: #7c8e9a;
`;

const Marquee = styled.div`
  display: flex;
  width: 1200px;
  overflow: hidden;
  user-select: none;

  mask-image: linear-gradient(
    to right,
    hsl(0 0% 0% / 0),
    hsl(0 0% 0% / 1) 10%,
    hsl(0 0% 0% / 1) 90%,
    hsl(0 0% 0% / 0)
  );
`;

const scrollX = keyframes`
  from {
    left: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const common = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  white-space: nowrap;
  width: 100%;
  animation: ${scrollX} 30s linear infinite;
`;

const MarqueeGroup = styled.div`
  ${common}
`;
const MarqueeGroup2 = styled.div`
  ${common}
  animation-direction: reverse;
  animation-delay: -3s;
`;

const ImageGroup = styled.div`
  display: grid;
  place-items: center;
  width: clamp(10rem, 1rem + 40vmin, 30rem);
  padding: calc(clamp(10rem, 1rem + 30vmin, 30rem) / 10);
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  /* border: 1px solid black; */
  border-radius: 0.5rem;
  aspect-ratio: 16/10;
  padding: 5px 20px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
