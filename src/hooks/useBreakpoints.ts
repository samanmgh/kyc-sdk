import {useState, useEffect} from 'react';

const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '976px',
  xl: '1440px'
};

export const useBreakpoints = () => {
  const [breakpointsState, setBreakpointsState] = useState({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
  });

  useEffect(() => {
    if (window) {
      handleMediaQueryChange();
      Object.values(mediaQueries(window)).forEach(mq => mq.addEventListener("change", handleMediaQueryChange));
    }
    return () => {
      Object.values(mediaQueries(window)).forEach(mq => mq.addEventListener("change", handleMediaQueryChange));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    const mediaQueries = (win: Window) => {
        return {
            sm: win.matchMedia(`(max-width: ${breakpoints.sm})`),
            md: win.matchMedia(`(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`),
            lg: win.matchMedia(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`),
            xl: win.matchMedia(`(min-width: ${breakpoints.lg})`)
        };
    };

    const handleMediaQueryChange = () => {
    const isXl = mediaQueries(window).xl.matches;
    const isLg = mediaQueries(window).lg.matches || isXl;
    const isMd = mediaQueries(window).md.matches || isLg;
    const isSm = mediaQueries(window).sm.matches || isMd;

    setBreakpointsState({isSm, isMd, isLg, isXl});
  };

  return breakpointsState;
};