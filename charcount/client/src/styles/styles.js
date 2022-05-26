export const CSS = {
  chartPositionsMobile: {
    verticalAlign: 'top',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  chartPositionsNormal: {
    verticalAlign: 'top',
  },
  borderedtdLight: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: '1px',
    padding: '5px',
  },
  borderedtdDark: {
    borderStyle: 'solid',
    borderColor: '#9B9B9B',
    borderWidth: '1px',
    padding: '5px',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  bottomnotes: {
    position: 'fixed',
    bottom: '0px',
    paddingTop: '10px',
    zIndex: '999',
    width: '100%',
    maxHeight: '70px', // bottom notes height
  },
  topnotes: {
    top: '1%',
    position: 'fixed',
    zIndex: '999',
  },
  belowNavBar: { // below topnotes
    marginTop: '50px',

    // to avoid scrolling by default on all pages even when they're nearly empty
    position: 'absolute',
    height: '90%',
    width: '96%',
  },
  nextToNavBar: { // below topnotes
    //marginTop: '50px',
    marginLeft: '18vw',

    // to avoid scrolling by default on all pages even when they're nearly empty
    position: 'absolute',
    height: '90%',
  },
  width100: {
    width: '100%',
  },
  width50: {
    width: '50%',
  },
  maxWidth95: {
    maxWidth: '95vw',
  },
  checkButtons: {
    padding: '5px',
    borderRadius: '5px',
    width: '100vw',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  progress_bar: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  themeToggler: {
    position: 'fixed',
    right: '10px',
    top: '10px',
    fontSize: '24px',
  },
  themeTogglerPC: {
    /*position: 'fixed',
    left: '10px',
    top: '10px',*/
    fontSize: '24px',
  },
  lightTheme: {
    body: '#D9E2FF',
    text: '#363537',
    toggleBorder: '#FFFFFF',
    background: '#363537',
  },
  darkTheme: {
    body: '#02000C',
    text: '#FCF3FF',
    toggleBorder: '#6B8096',
    background: '#999999',
  },
}
