interface Props {
  interests: string[];
  theme: string;
}

function Interests({ interests, theme }: Props) {
  return (
    <div>
      <h4>Interests</h4>
      <ul className={theme}>
        {interests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
      </ul>
    </div>
  );
}

export default Interests;
