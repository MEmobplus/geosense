// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {KEPLER_GL_NAME, KEPLER_GL_VERSION, KEPLER_GL_WEBSITE} from '@kepler.gl/constants';

const LogoTitle = styled.div`
  display: inline-block;
  margin-left: 6px;
`;

const LogoName = styled.div`
  .logo__link {
    color: ${props => props.theme.logoColor};
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.17px;
  }
`;
const LogoVersion = styled.div`
  font-size: 10px;
  color: ${props => props.theme.subtextColor};
  letter-spacing: 0.83px;
  line-height: 14px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const LogoSvgWrapper = styled.div`
  margin-top: 3px;
`;

const LogoSvg = () => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#1FBAD6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      transform="rotate(90 12 12)"
      stroke="#1FBAD6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2 12H22"
      stroke="#1FBAD6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
interface KeplerGlLogoProps {
  appName?: string;
  version?: string | boolean;
  appWebsite?: string;
}

const KeplerGlLogo = ({
  appName = KEPLER_GL_NAME,
  appWebsite = KEPLER_GL_WEBSITE,
  version = KEPLER_GL_VERSION
}: KeplerGlLogoProps) => (
  <LogoWrapper className="side-panel-logo">
    <LogoSvgWrapper>
      <LogoSvg />
    </LogoSvgWrapper>
    <LogoTitle className="logo__title">
      <LogoName className="logo__name">
        <a className="logo__link" target="_blank" rel="noopener noreferrer" href={appWebsite}>
          {appName}
        </a>
      </LogoName>
      {version ? <LogoVersion className="logo__version">{version}</LogoVersion> : null}
    </LogoTitle>
  </LogoWrapper>
);

export default KeplerGlLogo;
