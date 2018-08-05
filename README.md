# Request Data HOC

## Rationale

Data fetching adds another layer of complexity to your application. Every connected component needs an ability to declaratively request data that is required for further rendering and pass it on as props.

Data needs to be re-requested when it becomes undefined or request params change.

## Benefits

**Good separation of concerns**  
Your dumb UI components should just render what comes from above and know nothing about how and when to request data. They should not be handling error / loading states either.

**Composition is king**  
Request Data HOC plays nicely with react-router, redux `connect` and selectors. It allows for standalone `withErrors` / `withLoading` components to handle error and loading states.

**No more null checks**  
With composed components like `withLoading` you have the ability to not render your dumb UI component until all required data is there. That allows to reduce complexity and avoid all the annoying null checks on the props.

## A word of warning

There is a scenario when this HoC is used for widgets that require the same data. Multiple identical data requests will be fired and need to be handled separately in `redux-saga` or other middleware to make it efficient.
