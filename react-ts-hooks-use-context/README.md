# React Context

## Learning Goals

- Understand the use cases for React Context and what problems it solves
- Use `createContext` and the `useContext` hook to work with Context

## Introduction

So far, we've learned that there is only one way to share data across multiple
components: some parent component is responsible for passing down that data to
any child components that need it via **props**. However, for large applications
where many components need access to the same data, this approach can be a
burden.

The React Context API, and the `useContext` hook, allows us to share "global"
data between components without passing that data via props. Libraries like
React Router and React Redux take advantage of Context under the hood, so let's
see how we can use it in our applications as well!

## The Prop Sharing Problem

In this lesson, we have the following components:

```txt
App
├── Header
│   ├── ThemedButton
│   └── DarkModeToggle
└── Profile
    └── Interests
```

These components all need access to some shared state, which is currently kept
in the App component. Here's a diagram of the state the components share:

```txt
App [theme]
├── Header [theme, user]
│   ├── ThemedButton [theme]
│   └── DarkModeToggle [theme]
└── Profile [user]
    └── Interests [theme]
```

As you can see, even in this small example, we have several components that need
access to the same data.

In addition, because of the requirement that we must pass down data from parent
to child components, we have a couple of components that take in some data via
props, only to pass it along to a child component. For example, looking at the
`Profile` component, we can see that it takes in a `theme` prop, even though it
doesn't use it directly — it only needs to take this prop in so that it can pass
it down to the `Interests` component:

```tsx
// takes theme as a prop
function Profile({ user, theme }: Props) {
  if (!user) return <h2>Please Login To View Profile</h2>;
  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      {/* passes theme down to Interests */}
      <Interests interests={user.interests} theme={theme} />
    </div>
  );
}
```

This is known as **prop-drilling**, and it can become a burden for deeply-nested
component hierarchies.

Let's see how to use React Context to solve this problem.

## Creating Context

In order to create our context data, we need to create two things:

- The actual context object
- A context provider component

Let's start by creating the context for our `user` data. To organize our context
code, make a new file called `/src/context/user.tsx`. Then, create our context
and export it:

```jsx
// src/context/user.tsx
// import React
import React from "react";

// create the context
const UserContext = React.createContext();

// export it
export { UserContext };
```

Since we're working with TypeScript, our IDE complains that we didn't provide a
generic type or an initial value. In our case, we know what our user data will
look like - there's even a `User` type interface proided for us in `src/data.ts`
that we can import. We still don't want to provide an initial value, so instead
we can pass in `null`. As a result, our type should be `User | null`:

```tsx
// src/context/user.tsx
// import the User type
import { User } from "../data";

// type the context
const UserContext = React.createContext<User | null>(null);
```

After creating the context object, we need a special "provider" component that
will give access to the context data to its child components. Here's how we can
set up the context provider:

```tsx
// src/context/user.tsx

// import ReactNode from react
import React, { ReactNode } from "react";
import { User } from "../data";

const UserContext = React.createContext<User | null>(null);

// create a provider component
function UserProvider({ children }: { children: ReactNode }) {
  // the value prop of the provider will be our context data
  // this value will be available to child components of this provider
  return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
```

As we'll see next, the provider component needs to be wrapped around other
components that need access to the context data. In other words, the provider
_will_ have children passed to it, so we specify it in the props. The `children`
can be any type of element, from divs to lists to other components. So to type
it, we use a general umbrella type provided by React called `ReactNode` that
encompasses all elements it could be.

With our context created, and our provider component all set up, let's see how
we can use this context data from other components.

## Using Context

As we just learned, to give our components access to the context data, we must
first use the provider component to wrap around any component that need access
to the context. Based on our component hierarchy, the `Header` and `Profile`
components both need access to the `user` data in our context:

```txt
App [theme]
├── Header [theme, user]
│   ├── ThemedButton [theme]
│   └── DarkModeToggle [theme]
└── Profile [user]
    └── Interests [theme]
```

So let's update the `App` component with the `UserProvider`:

```tsx
// src/components/App.tsx
import { useState } from "react";
import Header from "./Header";
import Profile from "./Profile";
// import the provider
import { UserProvider } from "../context/user";

function App() {
  const [theme, setTheme] = useState("dark");
  // remove the user state

  return (
    <main className={theme}>
      {/* wrap components that need access to context data in the provider*/}
      <UserProvider>
        <Header theme={theme} setTheme={setTheme} />
        <Profile theme={theme} />
      </UserProvider>
    </main>
  );
}

export default App;
```

You'll notice we also removed the `user` prop from these components and deleted
the `useState` definition of `user`, since we'll be accessing that data via
context instead. TypeScript will now error saying that the components are
missing props. Don't worry, we will fix those as we go along.

Next, to access the context data from our components, we can use the
`useContext` hook. This is another hook that's built into React, and it lets us
access the `value` of our context provider in any child component. Here's how it
looks:

```jsx
// src/components/Profile.tsx

// import the useContext hook
import { useContext } from "react";
// import the UserContext we created
import { UserContext } from "../context/user";
import Interests from "./Interests";

// remove user from the Props interface
interface Props {
  theme: string;
}

// remove user from the destructured props
function Profile({ theme }) {
  // call useContext with our UserContext
  const user = useContext(UserContext);

  // now, we can use the user object just like we would if it was passed as a prop!
  console.log(user);
  if (!user) return <h2>Please Login To View Profile</h2>;
  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      <Interests interests={user.interests} theme={theme} />
    </div>
  );
}
```

> **Note**: At this point, there will still be an error for the `Header`
> component. We will fix that soon. However, to test out the app in the
> meantime, close out the errors by clicking on the "X" in the top right corner
> of the browser.

You can test this out by updating the `value` prop in our `UserProvider` to
something different, and see that the `Profile` component has access to the
updated data:

```jsx
// src/context/user.tsx

function UserProvider({ children }: { children: ReactNode }) {
  const currentUser = {
    name: "Duane",
    interests: ["Coding", "Biking", "Words ending in 'ing'"],
  };
  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
}
```

In the browser, you should now see Duane's profile. Remember to remove the
`currentUser` data and change the default value back to `null` after testing.

Next, let's hook up the `Header` component to our context as well:

```jsx
// src/components/Header.tsx

// import the useContext hook
import { useContext } from "react";
import ThemedButton from "./ThemedButton";
import DarkModeToggle from "./DarkModeToggle";
import defaultUser from "../data";
// import the context
import { UserContext } from "../context/user";

// remove user and setUser from the Props interface
interface Props {
  theme: string;
  setTheme(theme: string): void;
}

// remove user and setUser from the destructured props
function Header({ theme, setTheme }: Props) {
  // use context to get the user data
  const user = useContext(UserContext);

  // comment out the use of setUser within the handleLogin function for now
  function handleLogin() {
    if (user) {
      // setUser(null);
    } else {
      // setUser(defaultUser);
    }
  }

  return (
    <header>
      <h1>React Context</h1>
      <nav>
        <ThemedButton onClick={handleLogin} theme={theme}>
          {user ? "Logout" : "Login"}
        </ThemedButton>
        <DarkModeToggle theme={theme} setTheme={setTheme} />
      </nav>
    </header>
  );
}
```

One thing you'll notice is that our `Header` component also is meant to handle
logging in/logging out a user. In the first version of our app, that
functionality was available to use in the `App` component since we had a `user`
variable as **state**:

```tsx
// src/components/App.tsx
// old code just for review - do NOT change your App back to this
function App() {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState<User | null>(null);
  return (
    <main className={theme}>
      <Header theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <Profile theme={theme} user={user} />
    </main>
  );
}
```

We can re-gain this functionality by setting up the **context** value to be
stateful instead!

```tsx
// src/context/user.tsx

// import useState
import React, { ReactNode, useState } from "react";
import { User } from "../data";

// create a type interface for the UserContext now that it will have multiple variables
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// change the typing of the context to use the interface
const UserContext = React.createContext<UserContextType | null>(null);

function UserProvider({ children }: { children: ReactNode }) {
  // make the provider component stateful
  const [user, setUser] = useState<User | null>(null);

  // set the value as an object of user and setUser
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

Since the `UserProvider` component is still just a React component, we can use
any hooks we'd like within this component. In the code above, we're using
`useState` to create a `user` state variable as well as a setter function. In
the `Provider`, we're now using an **object** with `user` and `setUser` as the
**value** for our context.

Now that our context value contains more than just the `user` object, we have to
change the typing. It now has the `user` object, the `setUser` setter function,
and the possibility to be `null`. To make it cleaner, we created a type
interface `UserContextType` to type the `user` and `setUser` properties, then
used it in a union type with `null`.

> **Note**: For another example of using a hook within a provider: you could use
> the `useEffect` hook to have your provider component fetch some data from an
> API when it loads; or to read some saved data from `localStorage`.

After this update, `useContext()` now returns an object with all the values
provided. Instead of `user`, let's change the variable we save our context on to
`ctx`, which is short for context. We can then access our values via dot
notation, for example: `ctx.user` or `ctx.setUser`.

```jsx
function Header({ theme, setTheme }: Props) {
  // change context variable to ctx
  const ctx = useContext(UserContext);

  // update function to use ctx
  function handleLogin() {
    if (ctx?.user) {
      ctx?.setUser(null);
    } else {
      ctx?.setUser(defaultUser);
    }
  }

  return (
    <header>
      <h1>React Context</h1>
      <nav>
        {/* update ternary to use ctx */}
        <ThemedButton onClick={handleLogin} theme={theme}>
          {ctx?.user ? "Logout" : "Login"}
        </ThemedButton>
        <DarkModeToggle theme={theme} setTheme={setTheme} />
      </nav>
    </header>
  );
}
```

> **Note**: Because our context has the possibility of being null, TypeScript
> will error when trying to access values on `ctx`. To avoid that, we can use
> [optional chaining notation][optional chaining].,

We'll also need to update the `Profile` component since our context has changed:

```jsx
function Profile({ theme }: Props) {
  const ctx = useContext(UserContext);

  if (!ctx?.user) return <h2>Please Login To View Profile</h2>;
  return (
    <div>
      <h2>{ctx.user.name}'s Profile</h2>
      <Interests interests={ctx.user.interests} theme={theme} />
    </div>
  );
}
```

Now when you click the `Login` button on the browser, the app should show Duane
as a user and change the button to say `Logout`!

## Exercise

Now that you've seen one approach to using React Context for our user data, try
to implement React Context to handle the `theme` data for the app as well!

Completed code for this exercise is in the `solution` branch.

## A Word of Caution

Once new developers encounter context, it's often tempting to reach for it as a
solution to all your React state needs, since it helps save the pain of "prop
drilling". However, React recommends using context sparingly:

> Context is primarily used when some data needs to be accessible by many
> components at different nesting levels. Apply it sparingly because it makes
> component reuse more difficult.
>
> If you only want to avoid passing some props through many levels, component
> composition is often a simpler solution than context. —
> [Before You Use Context](https://reactjs.org/docs/context.html#before-you-use-context)

Keep this in mind when you're considering adding context to your application.
Think about whether or not the data that's being held in context is truly
_global_, and shared by many components.

This [video](https://youtu.be/3XaXKiXtNjw) by React Router creator Michael
Jackson shows an alternative to using context for the sake of saving from props
drilling, and demonstrates how to use _composition_ instead.

## Conclusion

React's Context system gives us a way to share global data across multiple
components without needing to pass that data via props. Context should be used
sparingly, but it is a helpful tool for simplifying our components and
minimizing the need for prop drilling.

## Resources

- [React Context](https://reactjs.org/docs/context.html)
- [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [Using Composition Instead of Context](https://youtu.be/3XaXKiXtNjw)
- [Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react)

[optional chaining]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
