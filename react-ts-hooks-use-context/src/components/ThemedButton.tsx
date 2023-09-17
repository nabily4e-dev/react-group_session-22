import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  theme: string;
}

function ThemedButton({ theme, ...props }: Props) {
  return (
    <button
      className={theme}
      {...props}
    />
  );
}

export default ThemedButton;
