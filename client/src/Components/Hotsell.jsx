import React from "react";
import Client1 from "../assets/img/Brands/Client1.jpg";
import Client2 from "../assets/img/Brands/Client2.jpg";
import Client3 from "../assets/img/Brands/Client3.jpg";
import Client4 from "../assets/img/Brands/Client4.jpg";
import Client5 from "../assets/img/Brands/Client5.jpg";
import Client6 from "../assets/img/Brands/Client6.jpg";
import Client7 from "../assets/img/Brands/Client7.jpg";
import Client8 from "../assets/img/Brands/Client8.jpg";

import styled, { keyframes, css } from "styled-components";

function Hotsell() {
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

  return (
    <div className="overflow-hidden">
    <AppContainer className="size overflow-hidden">
      <Wrapper>
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
        <Marquee></Marquee>
      </Wrapper>
    </AppContainer>
    </div>
  );
}

export default Hotsell;

const AppContainer = styled.div`
  width: 100vw;
  height: 15vh;
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
