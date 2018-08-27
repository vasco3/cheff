import React from 'react';
const CoreContext = React.createContext({});

// This function takes a component...
export function withCoreContext(Component) {
  // ...and returns another component...
  return function CoreComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <CoreContext.Consumer>
        {core => <Component {...props} {...core} />}
      </CoreContext.Consumer>
    );
  };
}

export default CoreContext;
