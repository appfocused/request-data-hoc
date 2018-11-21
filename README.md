# Request Data HOC 🏹
_built with ❤️ at www.appfocused.com_

## Rationale

Data fetching adds another layer of complexity to your application. Every connected component needs an ability to declaratively request data that is required for further rendering and pass it on as props.

Data will be re-requested when it becomes undefined or request params change.

## Benefits

**Good separation of concerns**  
Your presetational UI components should just render what comes from above and know nothing about how and when to request data. They should not be handling error / loading states either.

**Composition is king**  
Request Data HOC plays nicely with react-router, redux `connect` and selectors. It allows for standalone `withErrors` / `withLoading` components to handle error and loading states.

**No more null checks**  
With composed components like `withLoading` you have the ability to not render your dumb UI component until all required data is there. That allows to reduce complexity and avoid all the annoying null checks on the props.

---

## Getting started

`npm install @appfocused/request-data-hoc`  
or  
`yarn add @appfocused/request-data-hoc`

## Usage with Redux

[Example on Codesandbox](https://codesandbox.io/s/p7r4vy5xlq)

---

## A word of warning

There is a scenario when this HoC is used for widgets that require the same data. Multiple identical data requests will be fired and need to be handled separately in `redux-saga` or other middleware to make it efficient.

### Starter used for this library:

https://github.com/alexjoverm/typescript-library-starter
